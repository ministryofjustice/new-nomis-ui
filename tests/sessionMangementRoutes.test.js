const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');

const setCookie = require('set-cookie-parser');
const expect = require('chai').expect;

const sessionManagementRoutes = require('../server/sessionManagementRoutes');
const hmppsCookie = require('../server/hmppsCookie');
const contextProperties = require('../server/contextProperties');

const hmppsCookieName = 'testCookie';
const accessToken = 'aaa';
const refreshToken = 'bbb';

describe('Test the routes and middleware installed by sessionManagementRoutes', () => {
  const app = express();

  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser('keyboard cat'));
  app.use(session({
    name: 'foo-bar',
    secret: 'test',
    resave: false,
    saveUninitialized: true,
  }));

  const hmppsCookieOperations = hmppsCookie.cookieOperationsFactory({
    name: hmppsCookieName,
    cookieLifetimeInMinutes: 1,
    domain: '127.0.0.1',
    secure: false,
  });

  const nullFunction = () => {};

  const tokenSettingAuthenticate = (context, username, password) => new Promise((resolve) => {
    contextProperties.setTokens(context, accessToken, refreshToken);
    resolve();
  });

  const rejectedAuthenticate = rejectStatus =>
    () =>
      Promise.reject({ response: { status: rejectStatus } });

  const oauthApi = {
    authenticate: tokenSettingAuthenticate,
    refresh: nullFunction,
  };

  const eliteApi = {
    isUp: nullFunction,
  };

  /**
   * A Token refresher that does nothing.
   * @returns {Promise<void>}
   */
  const tokenRefresher = () => Promise.resolve();

  sessionManagementRoutes.configureRoutes({
    app,
    eliteApi,
    oauthApi,
    hmppsCookieOperations,
    tokenRefresher,
    mailTo: 'test@site.com' });

  // some content to send for '/'
  app.get('/', (req, res) => {
    res.send('static');
  });

  app.use((err, req, res, next) => {
    next();
  });

  // Maintain agent state (cookies).
  const agent = request.agent(app);

  it('/ redirects to /login', () =>
    agent
      .get('/')
      .expect(302)
      .expect('location', '/login')
  );

  it('successful login redirects to "/" setting hmpps cookie', () =>
    agent
      .post('/login')
      .send('username=test&password=testPassowrd')
      .expect(302)
      .expect('location', '/')
      .expect(hasCookies(['testCookie']))
  );

  it('/ with cookie serves content', () =>
    agent
      .get('/')
      .expect(200)
      .expect('static')
  );

  it('/logout clears the cookie', (done) => {
    agent
      .get('/logout')
      .expect(302)
      .expect('location', '/login')
      .expect(hasCookies(['testCookie']))
      .end(done);
  });

  it('After logout "/" should redirect to "/login"', () =>
    agent
      .get('/')
      .expect(302)
      .expect('location', '/login')
  );

  it('Unsuccessful signin - API up', () => {
    oauthApi.authenticate = rejectedAuthenticate(401);

    return agent
      .post('/login')
      .send('username=test&password=testPassowrd')
      .expect(401)
      .expect(res => {
        expect(res.error.path).to.equal('/login');
        expect(res.text).to.include('The username or password you have entered is invalid.');
      });
  });

  it('Unsuccessful signin - API donw', () => {
    oauthApi.authenticate = rejectedAuthenticate(503);

    return agent
      .post('/login')
      .send('username=test&password=testPassowrd')
      .expect(503)
      .expect(res => {
        expect(res.error.path).to.equal('/login');
        expect(res.text).to.include('Service unavailable. Please try again later.');
      })
  });
});

const hasCookies = expectedNames => res => {
  const cookieNames = setCookie.parse(res).map(cookie => cookie.name);
  expectedNames.forEach(name => expect(cookieNames).to.include(name));
  expect(cookieNames).to.have.lengthOf(expectedNames.length);
};