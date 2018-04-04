const url = require('url');
const session = require('./session');
const retry = require('./api/retry');
const { logger } = require('./services/logger');

const sessionHandler = (req, res) => {
  const destination = url.resolve(process.env.API_ENDPOINT_URL, `api${req.url}`);

  retry.callApi({
    method: req.method,
    url: destination,
    headers: getPagingHeaders(req),
    data: req.body,
    reqHeaders: { jwt: { access_token: req.access_token, refresh_token: req.refresh_token }, host: req.headers.host },
    onTokenRefresh: session.updateHmppsCookie(res),
  }).then(response => {
    copyHeadersOverToRes(response.headers, res);

    res.json(response.data);
  }).catch(error => {
    logger.error(error);
    res.status(retry.errorStatusCode(error.response));
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

