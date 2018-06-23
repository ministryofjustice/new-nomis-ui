const config = require('./config');
const tokenStore = require('./tokenStore');

const sessionExpiryMinutes = config.hmppsCookie.expiryMinutes * 60 * 1000;

const staticCookieConfig = {
  domain: config.hmppsCookie.domain,
  encode: String,
  path: '/',
  httpOnly: true,
  secure: config.app.production,
};

const encodeToBase64 = (string) => Buffer.from(string).toString('base64');
const decodedFromBase64 = (string) => Buffer.from(string, 'base64').toString('ascii');
const decodeCookieValue = (cookie) => JSON.parse(decodedFromBase64(cookie));
const getNowInMinutes = () => Math.floor(Date.now() / 60e3);

const isAuthenticated = (req) => req.session && req.session.isAuthenticated;

const isCookieValueValid = (cookieValue) => {
  if (!cookieValue) {
    return false;
  }
  const cookieData = decodeCookieValue(cookieValue);
  return !(!cookieData.access_token || !cookieData.refresh_token);
};

const hmppsSessionMiddleWare = (req, res, next) => {
  const cookieValue = req.cookies[config.hmppsCookie.name];

  if (!isCookieValueValid(cookieValue)) {
    endSession(req, res);
    return;
  }

  req.session.isAuthenticated = true;

  tokenStore.run(() => {
    const cookieData = decodeCookieValue(cookieValue);
    tokenStore.storeTokens(cookieData.access_token, cookieData.refresh_token);
    if (cookieData.nowInMinutes !== getNowInMinutes()) {
      setHmppsCookie(res);
    }
    next();
  })
};

const loginMiddleware = (req, res, next) => {
  if (req.url.includes('logout')) {
    next();
    return;
  }

  if (isAuthenticated(req)) {
    res.redirect('/');
    return;
  }
  next();
};

const endSession = (req, res) => {
  req.session = null;
  deleteHmppsCookie(res);

  const isXHRRequest = req.xhr || req.headers.accept.indexOf('json') > -1;

  if (isXHRRequest) {
    res.status(401);
    res.end();
    return;
  }

  res.redirect('/login');
};

const setHmppsCookie = (res) => {
  const cookieValue = encodeToBase64(JSON.stringify(
    { access_token: tokenStore.getAccessToken(),
      refresh_token: tokenStore.getRefreshToken(),
      nowInMinutes: getNowInMinutes(),
    }));

  const cookieConfig = Object.assign(
    {} ,
    staticCookieConfig,
    {
      expires: new Date(Date.now() + sessionExpiryMinutes),
      maxAge: sessionExpiryMinutes,
    });
  res.cookie(config.hmppsCookie.name, cookieValue, cookieConfig);
};

const deleteHmppsCookie = (res) => {
  res.clearCookie(config.hmppsCookie.name, staticCookieConfig);
};

const service = {
  hmppsSessionMiddleWare,
  loginMiddleware,
  setHmppsCookie,
  deleteHmppsCookie,
};

module.exports = service;
