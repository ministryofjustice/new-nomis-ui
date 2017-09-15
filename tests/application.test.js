const sinon = require('sinon');
const chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

const sinonChai = require('sinon-chai');
const axios = require('axios');
const application = require('../server/app');

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);

chai.use(sinonChai);


describe('application', () => {

  it('should return a 401 once the web session has timed out', () =>{

      const res = {
         status: sinon.spy(),
         end: sinon.spy()
      };

      application.sessionHandler({},res);

      expect(res.status).to.be.calledWith(401);
      expect(res.end).to.be.calledOnce;
  });

});