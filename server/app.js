const session = require('./session');
const apiService = require('./apiService'),
  errorStatusCode = apiService.errorStatusCode;

const sessionHandler = (req, res) => {
  apiService.callApi({
    method: req.method,
    url: req.url,
    headers: getPagingHeaders(req),
    reqHeaders: req.headers,
    onTokenRefresh: (token) => { req.headers.jwt = token },
  }).then(response => {
    copyHeadersOverToRes(response.headers,res);
    res.setHeader('jwt', session.extendSession(req.headers));
    res.json(response.data);
  }).catch(error => {
    res.status(errorStatusCode(error.response));
    res.end();
  })
};

const getPagingHeaders = (req) => {
  const headers = {}
  const pagingHeaders = ['page-offset','page-limit','sort-fields','sort-order'];

  pagingHeaders.forEach(k => {
    if (req.headers[k]) {
      headers[k] = req.headers[k];
    }
  });
  return headers;
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

module.exports = {
  sessionHandler,
};

