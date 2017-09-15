const axios = require('axios');
const generateJwtToken = require('./jwtToken');
const jwt = require('jsonwebtoken');

const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';

axios.defaults.baseURL = process.env.API_ENDPOINT_URL || 'http://localhost:7080/api';
axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'cache-control': 'no-store',
  'pragma': 'no-cache'
};

const minutes = process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 30;
const key = '2342424ldjnsdljfjklslfjkadflkjhaskjfhiq34uhrkjfbsdnakjfnbkajnbfdksjanfdkjnKADSAFSD';

const newJWT = (data) =>{

  return jwt.sign({
    data: data,
    exp: Math.floor(Date.now() / 1000) + (60 * minutes)
  },key );

 /* return jwt.sign({
      data: data,
      exp: Math.floor(Date.now() / 1000) + (60 * minutes)
    }, new Buffer(privateCert), {  algorithm: 'ES256' });

    */
};

const getTokenInfo = (req) => {
  try {

    const token = req.headers['jwt'];
    if (!token) return;

    return jwt.verify(token, key);
  }
  catch(e){}
};

const getHeader = (req, token) => {

  let headers = {
    'access-control-allow-origin': req.headers.host,
  };

  if(useApiAuth){
    headers['Authorization'] = `Bearer ${generateJwtToken()}`;

    if(token)
      headers['elite-authorization'] = token;

  }else{
    if(token)
      headers['Authorization'] = token;
  }

  return headers;
};

const login = (req, res, next) => {

  if( ! req.body) next();

  axios({
    method: 'post',
    url: '/users/login',
    headers: getHeader(req),
    data: req.body
  }).then( (response) => {
    const token = newJWT(response.data);
    res.json(token);
  });
};

const images = (req,res) => {

  if(endRequestIfSessionExpired(req,res))
    return;

  const webToken =  getTokenInfo(req);
  const token = webToken.data.token;

  axios({
    method: 'get',
    url: `images${req.url}`,
    responseType:'stream',
    headers: getHeader(req,token),
  }).then( (response) => {
    res.setHeader('jwt',newJWT(webToken.data));
    response.data.pipe(res);
  });
};

const sessionHandler = (req,res) => {

  if(endRequestIfSessionExpired(req,res))
    return;

  const tokenInfo = getTokenInfo(req);
  const {token,refreshToken} = tokenInfo.data;

  apiRequest(req,token).catch( (error) => {

    if(error.response.status === 401) {
     axios({
        method: 'post',
        url: '/users/token',
        headers: getHeader(req,refreshToken),
      }).then(response => {
        apiRequest(req, res, response.data.token).catch(error => {
          res.status(error.response.status);
          res.end();
        })
      });
    }
   });
};

const endRequestIfSessionExpired = (req,res) => {

  const tokenInfo = getTokenInfo(req);

  if( ! tokenInfo) {
    res.status(401);
    res.end();
    return true;
  }

  return false;
};

const apiRequest = (req,res,token) => {
  let options = {
    method: req.method,
    url: req.url,
    headers: getHeader(req,token)
  };

  if(req.body) options.data = req.body;

  return axios(options).then( (response) => {

    Object.keys(response.headers).map(key => {
      const value =  response.headers[key];

      if(value) {
        res.header(key, value);
      }
    });

    res.setHeader('jwt',newJWT(getTokenInfo(req).data));

    res.json(response.data);
  });
};

module.exports = {
  login: login,
  sessionHandler: sessionHandler,
  images: images,
};

