require('dotenv').config();
const config = require('../server/config');
const oauthApi = require('../server/api/oauthApi');
const tokenStore = require('../server/tokenStore');
const clientFactory = require('../server/api/oauthEnabledClient');

const eliteClient = clientFactory({
  baseUrl: config.apis.elite2.url,
  timeout: 10000,
  useGateway: config.app.useApiAuthGateway,
});


tokenStore.run(() => {
  const username = process.argv[2] || 'PBELL';
  const password = process.argv[3] || 'password123456';

  oauthApi.authenticate(username, password)
    .then(() => {
      console.info(`authenticate(${username}, *****) => `);
      console.info(`access token: ${tokenStore.getAccessToken()}`);
      console.info(`refresh token: ${tokenStore.getRefreshToken()}`);
    })
    .then(() => {
      console.log('get(api/agencies/)');
      return eliteClient.get('api/agencies/');
    })
    .then(result => {
      console.info(result.data);
    })
    .catch(error => {
      console.error(`code: ${error.code}`);
      console.error(`port ${error.port}`);
      console.error(`response: ${error.response}`)
    });
});
