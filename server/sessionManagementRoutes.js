const { logger } = require('./services/logger');
const clientVersionValidator = require('./middlewares/validate-client-version');

const contextProperties = require('./contextProperties');
const buildNumber = require('./application-version');

/**
 * This will be shared between the modules which handle errors which arise from failing api requests and
 * @param error
 * @returns {*}
 */
const errorStatusCode = (error) => {
  if (error && error.response) {
    return error.response.status;
  }

  if (error && error.code === 'ECONNREFUSED') {
    return 503;
  }

  return 500;
};

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
    const cookieValue = hmppsCookieOperations.getCookieValue(req);
    if (cookieValue) {  // implies authenticated
      res.redirect('/');
      return;
    }
    next();
  };

  const hmppsCookieMiddleware = async (req, res, next) => {
    hmppsCookieOperations.extractCookieValues(req, res.locals);
    if (contextProperties.hasTokens(res.locals)) {
      await tokenRefresher(res.locals);
      hmppsCookieOperations.setCookie(res, res.locals);
    }

    next();
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
      res.status(401);
      res.end();
      return;
    }

    res.redirect('/login');
  };

  app.get('/login', loginMiddleware, loginIndex);
  app.post('/login', login);
  app.get('/logout', logout);
  app.use(clientVersionValidator);

  app.use((req, res, next) => {
    // Keep track of when a server update occurs. Changes rarely.
    req.session.applicationVersion = buildNumber;
    next();
  });

  app.use(hmppsCookieMiddleware);
  app.use(requireLoginMiddleware);
};

module.exports = { configureRoutes };