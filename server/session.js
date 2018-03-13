const config = require('./config');

const sessionExpiryMinutes = config.hmppsCookie.expiryMinutes * 60 * 1000;

const encodeToBase64 = (string) => new Buffer(string).toString('base64');

const decodedFromBase64 = (string) => new Buffer(string, 'base64').toString('ascii');

const isAuthenticated = (request) => request.session && request.session.isAuthenticated;

const hmppsSessionMiddleWare = (req,res, next) => {
  const hmppsCookie = req.cookies[config.hmppsCookie.name];

  if (!hmppsCookie) {
    next();
    return;
  }

  const cookie = getHmppsCookieData(hmppsCookie);

  if (cookie.access_token && cookie.refresh_token) {
    req.access_token = cookie.access_token;
    req.refresh_token = cookie.refresh_token;

    if (!isAuthenticated(req)) {
      req.session.isAuthenticated = true;
    }
  }

  next();
}

const setHmppsCookie = (res, { access_token, refresh_token }) => {
  const tokens = encodeToBase64(JSON.stringify({ access_token, refresh_token }));
  const cookieConfig = {
    domain: config.hmppsCookie.domain,
    encode: String,
    expires: new Date(Date.now() + sessionExpiryMinutes),
    maxAge: sessionExpiryMinutes,
    path: '/',
    httpOnly: true,
    secure: config.app.production,
  };

  res.cookie(config.hmppsCookie.name, tokens, cookieConfig);
};

const getHmppsCookieData = (cookie) => JSON.parse(decodedFromBase64(cookie));

const updateHmppsCookie = (response) => (tokens) => {
  setHmppsCookie(response, tokens);
};

const deleteHmppsCookie = (response) => {
  response.clearCookie(config.hmppsCookie.name, { path: '/' });
}

const service = {
  deleteHmppsCookie,
  hmppsSessionMiddleWare,
  setHmppsCookie,
  updateHmppsCookie,
  isAuthenticated,
};

module.exports = service;