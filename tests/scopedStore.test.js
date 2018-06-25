const scopedStore = require('../server/scopedStore');
scopedStore.initialise();
const expect = require('chai').expect;

describe('Continuation local storage for JWT tokens', () => {
  it('Can store and retrive tokens (synchronously)', () => {
    scopedStore.run(() => {
      scopedStore.storeTokens('a', 'b');
      expect(scopedStore.getAccessToken()).to.equal('a');
      expect(scopedStore.getRefreshToken()).to.equal('b');
    });
  });

  it('Can store and retrive tokens (asynchronously) 1', (done) => {
    scopedStore.run(() => {
      scopedStore.storeTokens('a', 'b');
      getTokens()
        .then(assertTokens('a', 'b'))
        .then(done, done)
    });
  });

  it('Can store and retrive tokens (asynchronously) 2', (done) => {
    scopedStore.run(() => {
      scopedStore.storeTokens('a', 'b');
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

  it('Can store and retrive tokens (async/await)', (done) => {
    scopedStore.run(() => {
      scopedStore.storeTokens('a', 'b');

      (async () => {
        await setTokens('c', 'd')();
        assertTokens('c', 'd')(await getTokens());
        await setTokens('e','f')();
        assertTokens('e','f')(await getTokens());
      })().then(done, done);
    });
  });

  const setTokens = (accessToken, refreshToken) => () => new Promise(resolve => {
    scopedStore.storeTokens(accessToken, refreshToken);
    resolve();
  });

  const getTokens = () => new Promise(resolve => resolve(
    {
      accessToken: scopedStore.getAccessToken(),
      refreshToken: scopedStore.getRefreshToken(),
    }));

  const assertTokens = (expectedAccessToken, expectedRefreshToken) => (tokens) => {
    expect(tokens.accessToken).to.equal(expectedAccessToken, 'accessToken');
    expect(tokens.refreshToken).to.equal(expectedRefreshToken, 'refreshToken');
  };
});