/* eslint-disable no-console */
require('dotenv').config();
const config = require('../server/config');
const contextProperties = require('../server/contextProperties');
const oauthApiFactory = require('../server/api/oauthApi');
const clientFactory = require('../server/api/oauthEnabledClient');
const tokenRefresherFactory = require('../server/tokenRefresher').factory;

const oauthApi = oauthApiFactory(config.apis.elite2);

const eliteClient = clientFactory({
  baseUrl: config.apis.elite2.url,
  timeout: 10000,
  useGateway: config.app.useApiAuthGateway,
});

const refreshTokens = tokenRefresherFactory(oauthApi.refresh);

const context = {};

const authenticate = async () => {
  // const username = process.argv[2] || 'PBELL_GEN';
  // const password = process.argv[3] || 'password123456';

  const username = process.argv[2] || 'ITAG_USER';
  const password = process.argv[3] || 'password';

  await oauthApi.authenticate(context, username, password);
};

const getAgency = () => eliteClient.get(context, '/api/agencies');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const check = () => refreshTokens(context, 45)
    .then(getAgency)
    .then(result => {
      const agencies = result.data;
      console.log(new Date());
      console.log(agencies[0].description);
      console.log(`access_token:  ${contextProperties.getAccessToken(context)}`);
      console.log(`refresh_token: ${contextProperties.getRefreshToken(context)}`)
    })
    .then(() => delay(10000));

const program = () => {
  let p = authenticate();
  for (let i = 0; i < 24; i += 1) {
    p = p.then(check)
  }
  return p;
};

program()
  .then(() => console.log('done'))
  .catch(e => console.log(e));

