/* eslint-disable no-console */
require('dotenv').config();
const config = require('../server/config');
const contextProperties = require('../server/contextProperties');
const oauthApiFactory = require('../server/api/oauthApi');
const clientFactory = require('../server/api/oauthEnabledClient');

const eliteClient = clientFactory({
  baseUrl: config.apis.elite2.url,
  timeout: 10000,
  useGateway: config.app.useApiAuthGateway,
});


const username = process.argv[2] || 'PBELL_GEN';
const password = process.argv[3] || 'password123456';

const context = {};

const oauthApi = oauthApiFactory({ ...config.apis.elite2, useGateway: config.app.useApiAuthGateway });

oauthApi.authenticate(context, username, password)
  .then(() => {
    console.info(`authenticate(${username}, *****) => `);
    console.info(`access token: ${contextProperties.getAccessToken(context)}`);
    console.info(`refresh token: ${contextProperties.getRefreshToken(context)}`);
  })
  .then(() => {
    console.log('get(api/agencies/)');
    return eliteClient.get(context, 'api/agencies/');
  })
  .then(result => {
    console.info(result.data);
  })
  .catch(error => {
    console.error(`code: ${error.code}`);
    console.error(`port ${error.port}`);
    console.error(`response: ${error.response}`)
  });
