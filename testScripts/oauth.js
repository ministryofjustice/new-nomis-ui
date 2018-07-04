/* eslint-disable no-console */
require('dotenv').config();
const config = require('../server/config');
const oauthApiFactory = require('../server/api/oauthApi');
const common = require('./common');

const oauthApi = oauthApiFactory({...config.apis.elite2, useGateway: config.app.useApiAuthGateway});

const credentials = common.usage();

const context = {};

oauthApi
  .authenticate(context, credentials.username, credentials.password)
  .then(() => {
    console.info(`authenticate(${credentials.username}, *****)`);
    common.printTokens(context);
  })
  .then(() => oauthApi.refresh(context))
  .then(() => {
    console.info('refresh()');
    common.printTokens();
  })
  .catch(error => {
    console.error(`Caught error: Status ${error.response.status}`)
  });

