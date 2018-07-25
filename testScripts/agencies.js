/* eslint-disable no-console */
require('dotenv').config();
const config = require('../server/config');
const oauthApiFactory = require('../server/api/oauthApi');
const clientFactory = require('../server/api/oauthEnabledClient');
const common = require('./common');

const eliteClient = clientFactory({
  baseUrl: config.apis.elite2.url,
  timeout: 10000,
});

const oauthApi = oauthApiFactory({ ...config.apis.elite2 });

const credentials = common.usage();

const context = {};

oauthApi.authenticate(context, credentials.username, credentials.password)
  .then(() => {
    console.info(`authenticate(${credentials.username}, *****) => `);
    common.printTokens(context);
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
