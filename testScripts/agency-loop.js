/* eslint-disable no-console */
require('dotenv').config();
const config = require('../server/config');
const oauthApi = require('../server/api/oauthApi');
const scopedStore = require('../server/scopedStore');
const clientFactory = require('../server/api/oauthEnabledClient');

const eliteClient = clientFactory({
  baseUrl: config.apis.elite2.url,
  timeout: 10000,
  useGateway: config.app.useApiAuthGateway,
});

const authenticate = async () => {
  const username = process.argv[2] || 'PBELL';
  const password = process.argv[3] || 'password123456';

  await oauthApi.authenticate(username, password);
};

const getAgency = () => eliteClient.get('/api/agencies');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const check = () => getAgency()
  .then(result => {
    const agencies = result.data;
    console.log(new Date());
    console.log(agencies[0].description);
    console.log(`access_token:  ${scopedStore.getAccessToken()}`);
    console.log(`refresh_token: ${scopedStore.getRefreshToken()}`)
  })
  .then(() => delay(10000));

const program = () => {
  let p = authenticate();
  for (let i = 0; i < 24; i += 1) {
    p = p.then(check)
  }
  return p;
};

scopedStore.run(() => {
  program()
    .then(() => console.log('done'))
    .catch(e => console.log(e));
});

