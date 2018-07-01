const { logger } = require('./services/logger');
const errorStatusCode = require('./error-status-code');

const contextProperties = require('./contextProperties');

/**
 * Add session management related routes to an express 'app'.
 * These handle login, logout, and middleware to handle the JWT token cookie. (hmppsCookie).
 * @param app an Express instance.
 * @param eliteApi a configured eliteApi instance.
 * @param oauthApi (authenticate, refresh)
 * @param hmppsCookieOperations (setCookie, extractCookieValues, clearCookie)
 * @param tokenRefresher a function which uses the 'context' object to perform an OAuth token refresh (returns a promise).
 * @param mailTo The email address displayed at the bottom of the login page.
 */
const configureRoutes = ({ app, eliteApi, oauthApi, hmppsCookieOperations, tokenRefresher, mailTo }) => {
  const loginIndex = async (req, res) => {
    const isApiUp = await eliteApi.isUp();
    logger.info(`loginIndex - health check called and the isaAppUp = ${isApiUp}`);
    res.render('pages/login', { authError: false, apiUp: isApiUp, mailTo });
  };

  const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
      await oauthApi.authenticate(res.locals, username, password);

      hmppsCookieOperations.setCookie(res, res.locals);

      res.redirect('/');
    } catch (error) {
      const code = errorStatusCode(error);
      res.status(code);
      logger.error(error);
      if (code < 500) {
        logger.warn('Login failed, invalid password', { user: String(username) });
        res.render('pages/login', { authError: true, apiUp: true, mailTo });
      } else {
        logger.error(error);
        res.render('pages/login', { authError: false, apiUp: false, mailTo });
      }
    }
  };

  const logout = (req, res) => {
    hmppsCookieOperations.clearCookie(res);
    res.redirect('/login');
  };

  /**
   * A client who sends valid OAuth tokens when visits the login page is redirected to the
   * react application at '/'
   * @param req
   * @param res
   * @param next
   */
  const loginMiddleware = (req, res, next) => {
    hmppsCookieOperations.extractCookieValues(req, res.locals);
    if (contextProperties.hasTokens(res.locals)) {  // implies authenticated
      res.redirect('/');
      return;
    }
    next();
  };

  const hmppsCookieMiddleware = async (req, res, next) => {
    try {
      hmppsCookieOperations.extractCookieValues(req, res.locals);
      if (contextProperties.hasTokens(res.locals)) {
        await tokenRefresher(res.locals);
        hmppsCookieOperations.setCookie(res, res.locals);
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * If the context does not contain an accessToken the client is denied access to the
   * application and is redirected to the login page.
   * (or if this is a 'data' request then the response is an Http 404 status (Not Found)
   * @param req
   * @param res
   * @param next
   */
  const requireLoginMiddleware = (req, res, next) => {
    if (contextProperties.hasTokens(res.locals)) {
      next();
      return;
    }
    const isXHRRequest = req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1);

    if (isXHRRequest) {
      res.sendStatus(401);
      return;
    }

    res.redirect('/login');
  };


  app.get('/login', loginMiddleware, loginIndex);
  app.post('/login', login);
  app.get('/logout', logout);

  app.use(hmppsCookieMiddleware);
  app.use(requireLoginMiddleware);

  /**
   * An end-point that does nothing.
   * Clients can periodically 'ping' this end-point to refresh the cookie 'session' and JWT token.
   * Must be installed after the middleware so that OAuth token refresh happens.
   */
  app.use('/heart-beat', (req, res) => { res.sendStatus(200); });
};

module.exports = { configureRoutes };