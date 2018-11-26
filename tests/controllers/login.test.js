const sinon = require('sinon')
const chai = require('chai')

const { expect } = chai
const sinonChai = require('sinon-chai')
const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const passport = require('passport')
const flash = require('connect-flash')
const request = require('supertest')

const sessionManagementRoutes = require('../../server/sessionManagementRoutes')
const auth = require('../../server/auth')
const { AuthClientError } = require('../../server/api/oauthApi')

chai.use(sinonChai)

describe('POST /signin', () => {
  let sandbox
  const app = express()

  app.set('view engine', 'ejs')
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(
    cookieSession({
      name: 'testCookie',
      maxAge: 1 * 60 * 1000,
      secure: false,
      signed: false, // supertest can't cope with multiple cookies - https://github.com/visionmedia/supertest/issues/336
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())

  const nullFunction = () => {}

  const oauthApi = {
    authenticate: nullFunction,
    refresh: nullFunction,
  }
  auth.init(oauthApi)

  const healthApi = {
    isUp: () => Promise.resolve(true),
  }
  const tokenRefresher = sinon.stub()

  sessionManagementRoutes.configureRoutes({ app, healthApi, tokenRefresher, mailTo: 'test@site.com' })

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    sandbox.stub(oauthApi, 'authenticate').returns({ access_token: 'token' })
  })

  afterEach(() => sandbox.restore())

  describe('Successful signin', () => {
    it('redirects to "/" path', () =>
      request
        .agent(app)
        .post('/login')
        .send('username=officer&password=password')
        .expect(302)
        .expect('location', '/'))
  })

  describe('Unsuccessful signin - API up', () => {
    it('redirects to "/login" path', () => {
      oauthApi.authenticate.rejects(AuthClientError('The username or password you have entered is invalid.'))

      return request
        .agent(app)
        .post('/login')
        .send('username=test&password=testPassowrd')
        .redirects(1)
        .expect(/Login/)
        .expect(res => {
          expect(res.text).to.include('The username or password you have entered is invalid.')
        })
    })
  })

  describe('Unsuccessful signin - API down', () => {
    it('redirects to "/login" path', () => {
      oauthApi.authenticate.rejects({ response: { status: 503 } })

      return request
        .agent(app)
        .post('/login')
        .send('username=officer&password=password')
        .redirects(1)
        .expect(/Login/)
        .expect(res => {
          expect(res.text).to.include('A system error occurred; please try again later')
        })
    })
  })
})
