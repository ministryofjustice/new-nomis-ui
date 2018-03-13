const session = require('./session');
const apiService = require('./elite2Api');
const { logger } = require('./services/logger');

const errorStatusCode = apiService.errorStatusCode;

const sessionHandler = (req, res) => {
  apiService.callApi({
    method: req.method,
    url: `/api${req.url}`,
    headers: getPagingHeaders(req),
    data: req.body,
    reqHeaders: { jwt: { access_token: req.access_token, refresh_token: req.refresh_token }, host: req.headers.host },
    onTokenRefresh: session.updateHmppsCookie(res),
  }).then(response => {
    copyHeadersOverToRes(response.headers, res);

    res.json(response.data);
  }).catch(error => {
    logger.error(error);
    res.status(errorStatusCode(error.response));
    res.end();
  })
};

const getPagingHeaders = (req) => {
  const headers = {};
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

