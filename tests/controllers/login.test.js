const sinon = require('sinon')
const chai = require('chai')

const { expect } = chai
const sinonChai = require('sinon-chai')
const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const request = require('supertest')

const sessionManagementRoutes = require('../../server/sessionManagementRoutes')

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

  const nullFunction = () => {}

  const oauthApi = {
    authenticate: nullFunction,
    refresh: nullFunction,
  }

  const healthApi = {
    isUp: nullFunction,
  }

  sessionManagementRoutes.configureRoutes({ app, healthApi, oauthApi, mailTo: 'test@site.com' })

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    sandbox.stub(oauthApi, 'authenticate')
  })

  afterEach(() => sandbox.restore())

  describe('Successful signin', () => {
    it('redirects to "/" path', () =>
      request(app)
        .post('/login')
        .send('username=officer&password=password')
        .expect(302)
        .expect(res => {
          expect(res.headers.location).to.eql('/')
        }))
  })

  describe('Unsuccessful signin - API up', () => {
    it('redirects to "/login" path', () => {
      oauthApi.authenticate.rejects({ response: { status: 401 } })

      return request(app)
        .post('/login')
        .send('username=officer&password=password')
        .expect(401)
        .expect(res => {
          expect(res.error.path).to.equal('/login')
          expect(res.text).to.include('The username or password you have entered is invalid.')
        })
    })
  })

  describe('Unsuccessful signin - API down', () => {
    it('redirects to "/login" path', () => {
      oauthApi.authenticate.rejects({ response: { status: 503 } })

      return request(app)
        .post('/login')
        .send('username=officer&password=password')
        .expect(503)
        .expect(res => {
          expect(res.error.path).to.equal('/login')
          expect(res.text).to.include('Service unavailable. Please try again later.')
        })
    })
  })
})
