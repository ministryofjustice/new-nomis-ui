/* eslint-disable no-console */
require('dotenv').config();
const config = require('../server/config');
const oauthApi = require('../server/api/oauthApi');
const scopedStore = require('../server/scopedStore');

scopedStore.run(() => {
  const username = process.argv[2] || 'PBELL';
  const password = process.argv[3] || 'password123456';

  oauthApi.authenticate(username, password)
    .then(() => {
      console.info(`authenticate(${username}, *****) => `);
      console.info(`access token: ${scopedStore.getAccessToken()}`);
      console.info(`refresh token: ${scopedStore.getRefreshToken()}`);
    })
    .then(oauthApi.refresh)
    .then(() => {
      console.info('refresh() => ');
      console.info(`access token: ${scopedStore.getAccessToken()}`);
      console.info(`refresh token: ${scopedStore.getRefreshToken()}`);
    })
    .catch(error => {
      console.log(config);
      console.log(error);
    });
});
