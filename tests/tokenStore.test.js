const expect = require('chai').expect;

const tokenStore = require('../server/tokenStore');

describe('Continuation local storage for JWT tokens', () => {
  it('Can store and retrive tokens (synchronously)', () => {
    tokenStore.run(() => {
      tokenStore.storeTokens('a', 'b');
      expect(tokenStore.getAccessToken()).to.equal('a');
      expect(tokenStore.getRefreshToken()).to.equal('b');
    });
  });

  it('Can store and retrive tokens (asynchronously) 1', (done) => {
    tokenStore.run(() => {
      tokenStore.storeTokens('a', 'b');
      getTokens()
        .then(assertTokens('a', 'b'))
        .then(done, done)
    });
  });

  it('Can store and retrive tokens (asynchronously) 2', (done) => {
    tokenStore.run(() => {
      tokenStore.storeTokens('a', 'b');
      Promise.resolve()
        .then(setTokens('c', 'd'))
        .then(getTokens)
        .then(assertTokens('c', 'd'))
        .then(setTokens('e','f'))
        .then(getTokens)
        .then(assertTokens('e','f'))
        .then(done, done);
    });
  });

  const setTokens = (accessToken, refreshToken) => () => new Promise(resolve => {
    tokenStore.storeTokens(accessToken, refreshToken);
    resolve();
  });

  const getTokens = () => new Promise(resolve => resolve(
    {
      accessToken: tokenStore.getAccessToken(),
      refreshToken: tokenStore.getRefreshToken(),
    }));

  const assertTokens = (expectedAccessToken, expectedRefreshToken) => (tokens) => {
    expect(tokens.accessToken).to.equal(expectedAccessToken, 'accessToken');
    expect(tokens.refreshToken).to.equal(expectedRefreshToken, 'refreshToken');
  };
});