/* eslint-disable no-console */
require('dotenv').config();
const config = require('../server/config');
const oauthApiFactory = require('../server/api/oauthApi');
const { logger } = require('../server/services/logger');
const contextProperties = require('../server/contextProperties');

const username = process.argv[2] || 'PBELL_GEN';
const password = process.argv[3] || 'password123456';

const context = {};

const oauthApi = oauthApiFactory({ ...config.apis.elite2, useGateway: config.app.useApiAuthGateway });

oauthApi
  .authenticate(context, username, password)
  .then(() => {
    logger.info(`authenticate(${username}, *****). access token: ${contextProperties.getAccessToken(context)} refresh token: ${contextProperties.getRefreshToken(context)}`);
  })
  .then(() => oauthApi.refresh(context))
  .then(() => {
    logger.info(`refresh()                   access token: ${contextProperties.getAccessToken(context)} refresh token: ${contextProperties.getRefreshToken(context)}`);
  })
  .catch(error => {
    logger.error(`Caught error: Status ${error.response.status}`)
  });

