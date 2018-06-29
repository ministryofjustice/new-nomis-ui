const expect = require('chai').expect;
const contextProperties = require('../server/contextProperties');

describe('Should read/write properties', () => {
  it('Should set / get tokens', () => {
    const context = {};
    contextProperties.setTokens(context, 'a', 'b');
    expect(contextProperties.getAccessToken(context)).to.be.equal('a');
    expect(contextProperties.getRefreshToken(context)).to.be.equal('b');
  });

  it('Should return null if tokens not present', () => {
    const context = {};
    expect(contextProperties.getAccessToken(context)).to.be.null;
    expect(contextProperties.getRefreshToken(context)).to.be.null;
  });

  it('Should know if the context has no tokens', () => {
    expect(contextProperties.hasTokens(null)).to.be.false;
    expect(contextProperties.hasTokens(undefined)).to.be.false;
    expect(contextProperties.hasTokens({})).to.be.false;
  });

  it('Should know if the context has tokens', () => {
    const context = {};
    contextProperties.setTokens(context, null, null);
    expect(contextProperties.hasTokens(context)).to.be.false;

    contextProperties.setTokens(context, '', '');
    expect(contextProperties.hasTokens(context)).to.be.false;

    contextProperties.setTokens(context, 'a', '');
    expect(contextProperties.hasTokens(context)).to.be.false;

    contextProperties.setTokens(context, '', 'b');
    expect(contextProperties.hasTokens(context)).to.be.false;

    contextProperties.setTokens(context, 'a', 'b');
    expect(contextProperties.hasTokens(context)).to.be.true;
  });
});