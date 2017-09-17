const sinon = require('sinon');
const chai = require('chai'),
  expect = chai.expect;

const sinonChai = require('sinon-chai');
const application = require('../server/app');

chai.use(sinonChai);


describe('application', () => {
  it('should return a 401 once the web session has timed out', () => {
    const res = {
      status: sinon.spy(),
      end: sinon.spy(),
    };

    application.sessionHandler({},res);

    expect(res.status).to.be.calledWith(401);
    expect(res.end).to.be.calledOnce;
  });
});