const supertest = require('supertest')
const express = require('express')
const { controllerFactory } = require('../server/controller')

describe('controller tests', () => {
  describe('alerts', () => {
    const elite2Api = {
      getDetailsLight: () => ({ bookingId: 1 }),
    }

    const controller = controllerFactory({ elite2Api })

    const app = express()
    app.use('/app/bookings/:offenderNo/alerts', controller.alerts)
    const request = supertest(app)

    beforeEach(() => {
      elite2Api.get = jest.fn()
    })

    it('Should reject " " as an offender number', () => request.get('/app/bookings/ /alerts').expect(400))

    it('Should reject "x" as an offender number', () => request.get('/app/bookings/x/alerts').expect(400))

    it('Should accept "X1" as an offender number', () => request.get('/app/bookings/X1/alerts').expect(200))

    it('Should invoke elite2Api.get with the correct url', () =>
      request
        .get('/app/bookings/X1/alerts')
        .expect(200)
        .then(() => {
          expect(elite2Api.get.mock.calls[0][1]).toBe('/api/bookings/1/alerts')
        }))

    it('Should invoke elite2Api.get with the correct "from" query parameter', () =>
      request
        .get('/app/bookings/XXX/alerts?from=2011-01-01')
        .expect(200)
        .then(() => {
          expect(elite2Api.get.mock.calls[0][1]).toBe("/api/bookings/1/alerts?query=dateCreated:gteq:DATE'2011-01-01'")
        }))

    it('Should invoke elite2Api.get with the correct "to" query parameter', () =>
      request
        .get('/app/bookings/XXX/alerts?to=2011-01-01')
        .expect(200)
        .then(() => {
          expect(elite2Api.get.mock.calls[0][1]).toBe("/api/bookings/1/alerts?query=dateCreated:lteq:DATE'2011-01-01'")
        }))

    it('Should invoke elite2Api.get with the correct "alertType" query parameter', () =>
      request
        .get('/app/bookings/XXX/alerts?alertType=R')
        .expect(200)
        .then(() => {
          expect(elite2Api.get.mock.calls[0][1]).toBe("/api/bookings/1/alerts?query=alertType:in:'R'")
        }))

    it('Should invoke elite2Api.get, combining the query parameters correctly', () =>
      request
        .get('/app/bookings/XXX/alerts?alertType=R&from=2011-01-01&to=2020-12-31')
        .expect(200)
        .then(() => {
          expect(elite2Api.get.mock.calls[0][1]).toBe(
            "/api/bookings/1/alerts?query=dateCreated:gteq:DATE'2011-01-01',and:dateCreated:lteq:DATE'2020-12-31',and:alertType:in:'R'"
          )
        }))

    it('Should reject an invalid "to" value', () => request.get('/app/bookings/XXX/alerts?to=2011-01-011').expect(400))

    it('Should reject an invalid "from" value', () => request.get('/app/bookings/XXX/alerts?to=201-01-01').expect(400))

    it('Should reject an invalid "alertType" value', () =>
      request.get('/app/bookings/XXX/alerts?alertType=999').expect(400))
  })
})
