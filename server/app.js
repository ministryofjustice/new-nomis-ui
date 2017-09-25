/* eslint-disable no-empty,consistent-return */
const axios = require('axios');
const generateTokenForNomisAPI = require('./jwtToken');
const jwt = require('jsonwebtoken');

const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';
const minutes = process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 20;
const key = process.env.NOMS_TOKEN;

axios.defaults.baseURL = process.env.API_ENDPOINT_URL || 'http://localhost:7080/api';

const login = (req, res) => {
  service.makeRequest({
    method: 'post',
    url: '/users/login',
    headers: getRequestHeaders(req),
    data: req.body,
  }).then((response) => {
    const headers = response.headers;
    const jwtToken = newJWT(response.data);

    setResponseHeaders({ headers, res, req });
    res.json(jwtToken);
  }).catch(() => {
    res.status(401);
    res.end();
  });
};

const images = (req, res) => {
  if (endRequestIfSessionExpired(req, res)) { return; }

  const webToken = getTokenInfo(req);
  const token = webToken.data.token;

  axios({
    method: 'get',
    url: `images${req.url}`,
    responseType: 'stream',
    headers: getRequestHeaders(req, token),
  }).then((response) => {
    const jwtToken = newJWT(webToken.data);
    const headers = response.headers;

    setResponseHeaders({ jwtToken,headers, res, req });
    response.data.pipe(res);
  }).catch((error) => {
    res.status(error.status);
    res.json(error.data);
  });
};

const keyDates = (req,res) => {
  if (endRequestIfSessionExpired(req, res)) { return; }

  if (!req.params.bookingId) {
    res.status(400);
    res.end();
    return;
  }

  const webToken = getTokenInfo(req);
  const token = webToken.data.token;
  const getSentenceData = axios({
    method: 'get',
    url: `v2/bookings/${req.params.bookingId}/sentenceDetail`,
    headers: getRequestHeaders(req, token),
  }).then(response => new Promise(r => r({ sentence: response.data })));

  Promise.all([getSentenceData]).then(response => {
    const sentence = response[0].sentence;

    res.json({
      iepLevel: 'Standard',
      daysSinceReview: 27,
      sentence: {
        startDate: sentence.sentenceStartDate,
        adjudicationDaysAdded: sentence.additionalDaysAwarded,
        endDate: sentence.sentenceExpiryDate,
        daysRemaining: sentence.daysRemaining,
      },
      other: {
        crd: '23/10/2014',
        ped: '04/06/2017',
        led: '03/12/2018',
        hdcEligibilityDate: 'N/A',
      },
    });
  }).catch(error => {
    res.status(error.response.status);
    res.json(error.response.data);
  });
};


function makeRequest(options) {
  return axios(options);
}

function requestNewToken({ req, refreshToken }) {
  return new Promise((resolve,reject) => {
    axios({
      method: 'post',
      url: '/users/token',
      headers: getRequestHeaders(req, refreshToken),
    }).then(resolve).catch(reject);
  })
}


const newJWT = (data) => jwt.sign({ data,
  exp: Math.floor(Date.now() / 1000) + (60 * minutes),
}, key);

const getTokenInfo = (req) => {
  try {
    const token = req.headers.jwt;
    if (!token) return;

    return jwt.verify(token, key);
  } catch (e) {}

  return null;
};

const sessionHandler = (req, res) => {
  if (endRequestIfSessionExpired(req, res)) { return; }

  const tokenInfo = getTokenInfo(req);
  const { token, refreshToken } = tokenInfo.data;

  apiRequest(req, res, token).catch((error) => {
    if (error.response.status === 401) {
      service.requestNewToken({ req, refreshToken }).then((response) => {
        // Retry previous request with a fresh token
        apiRequest(req, res, response.data.token).catch((err) => {
          const headers = err.headers;
          setResponseHeaders({ headers, res, req, jwtToken: newJWT(response.data) });
          res.status(err.response.status);
          res.end();
        });
      }).catch((err) => {
        res.status(err.response.status);
        res.end();
      });
    }
  });
};

const endRequestIfSessionExpired = (req, res) => {
  const tokenInfo = getTokenInfo(req);

  if (!tokenInfo) {
    res.status(401);
    res.end();
    return true;
  }

  return false;
};

const apiRequest = (req, res, token) => {
  const options = {
    method: req.method,
    url: req.url,
    headers: getRequestHeaders(req, token),
  };

  if (req.body) options.data = req.body;

  return service.makeRequest(options).then((response) => {
    const jwtToken = newJWT(getTokenInfo(req).data);
    const headers = response.headers;

    setResponseHeaders({ headers, res, req, jwtToken });
    res.json(response.data);
  });
};

const getRequestHeaders = (req, token) => {
  const headers = {
    'access-control-allow-origin': req.headers.host,
  };

  const pagingHeaders = ['page-offset','page-limit','sort-fields','sort-order'];

  pagingHeaders.forEach(k => {
    if (req.headers[k]) {
      headers[k] = req.headers[k];
    }
  });

  if (useApiAuth) {
    headers.Authorization = `Bearer ${generateTokenForNomisAPI()}`;

    if (token) { headers['elite-authorization'] = token; }
  } else if (token) { headers.Authorization = token; }

  return headers;
};

const setResponseHeaders = ({ headers, res, req, jwtToken }) => {
  copyHeadersOverToRes(headers,res);

  res.setHeader('access-control-allow-origin', req.headers.host);
  res.setHeader('X-Requested-With', 'XMLHttpRequest');
  res.setHeader('cache-control', 'no-store');
  res.setHeader('pragma','no-cache');

  if (jwtToken) {
    res.setHeader('jwt', jwtToken);
  }
};

const copyHeadersOverToRes = (headers, res) => {
  if (!headers) { return; }

  Object.keys(headers).forEach(header => {
    const value = headers[header];
    if (value) {
      res.setHeader(header, value);
    }
  });
};

let service = {
  login,
  sessionHandler,
  images,
  newJWT,
  makeRequest,
  requestNewToken,
  keyDates,
};

module.exports = service;

