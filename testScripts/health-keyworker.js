require('dotenv').config();
const config = require('../server/config');
const tokenStore = require('../server/tokenStore');
const clientFactory = require('../server/api/oauthEnabledClient');

const eliteClient = clientFactory({
  baseUrl: config.apis.keyworker.url,
  timeout: 10000,
  useGateway: false,
});

tokenStore.run(() => {
  console.log('get(health)');
  eliteClient.get('health')
    .then(result => {
      console.info(result.data);
    })
    .catch(error => {
      console.error(`code: ${error.code}`);
      console.error(`port ${error.port}`);
      console.error(`response: ${error.response}`)
    });
});
