const axios = require('axios');
const generateJwtToken = require('./jwtToken');

const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';

axios.defaults.baseURL = process.env.API_ENDPOINT_URL || 'http://localhost:7080/api';
axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'cache-control': 'no-store',
  'pragma': 'no-cache'
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
    req.session.tokenInfo = response.data;
    res.json(response.data);
  }).catch( error =>{

  });
};

const images = (req,res) => {

  if(endRequestIfSessionExpired(req,res))
    return;

  const tokenInfo =  req.session && req.session.tokenInfo;

  axios({
    method: 'get',
    url: `images${req.url}`,
    responseType:'stream',
    headers: getHeader(req,tokenInfo.token),
  }).then( (response) => {
      response.data.pipe(res);
  });
};

const sessionHandler = (req,res) => {

  if(endRequestIfSessionExpired(req,res))
    return;

  const tokenInfo =  req.session && req.session.tokenInfo;

  apiRequest(req,res,tokenInfo.token).catch( (error) => {

    if(error.response.status === 401) {

     axios({
        method: 'post',
        url: '/users/token',
        headers: getHeader(req,tokenInfo.refreshToken),
      }).then(response => {
        req.session.tokenInfo = response.data;
        apiRequest(req, res, response.data.token).catch(error => {
          res.status(error.response.status);
          res.end();
        })
      });
    }
   });
};

const endRequestIfSessionExpired = (req,res) => {

  const tokenInfo =  req.session && req.session.tokenInfo;

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

    res.json(response.data);
  });
};

module.exports = {
  login: login,
  sessionHandler: sessionHandler,
  images: images
};

