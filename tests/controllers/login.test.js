const sinon = require('sinon');
const chai = require('chai'),
  expect = chai.expect;
const sinonChai = require('sinon-chai');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');
const request = require('supertest');

const { loginIndex, login } = require('../../server/controller');
const retry = require('../../server/api/retry');

chai.use(sinonChai);


describe('POST /signin', () => {
  let sandbox;
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

  app.get('/login', loginIndex);
  app.post('/login', login);

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(retry,'getApiHealth');
    sandbox.stub(retry,'httpRequest');
  });

  afterEach(() => sandbox.restore());

  describe('Successful signin', () => {
    it('redirects to "/" path', () => {
      retry.getApiHealth.resolves({
        data: {
          status: 'UP',
        },
      });
      retry.httpRequest.resolves({
        data: {
          access_token: 'abc.def.egs',
          refresh_token: 'der.ffg.eew',
        },
      });

      return request(app)
        .post('/login')
        .send('username=officer&password=password')
        .expect(302)
        .expect((res) => {
          expect(res.headers.location).to.eql('/');
        });
    });
  });

  describe('Unsuccessful signin - API up', () => {
    it('redirects to "/login" path', () => {

      retry.httpRequest.rejects({ response: { status: 401 } });

      return request(app)
        .post('/login')
        .send('username=officer&password=password')
        .expect(401)
        .expect((res) => {
          expect(res.error.path).to.equal('/login');
          expect(res.text).to.include('The username or password you have entered is invalid.');
        });
    });
  });

  describe('Unsuccessful signin - API down', () => {
    it('redirects to "/login" path', () => {
      retry.httpRequest.rejects({ response: { status: 503 } });

      return request(app)
        .post('/login')
        .send('username=officer&password=password')
        .expect(503)
        .expect((res) => {
          expect(res.error.path).to.equal('/login');
          expect(res.text).to.include('Service unavailable. Please try again later.');
        });
    });
  });
});