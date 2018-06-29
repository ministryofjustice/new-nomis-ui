/* eslint-disable no-console */
require('dotenv').config();
const config = require('../server/config');
const oauthApiFactory = require('../server/api/oauthApi');
const contextProperties = require('../server/contextProperties');

// const username = process.argv[2] || 'PBELL_GEN';
// const password = process.argv[3] || 'password123456';

const username = process.argv[2] || 'ITAG_USER';
const password = process.argv[3] || 'password';

const context = {};

const oauthApi = oauthApiFactory(config.apis.elite2);

oauthApi.authenticate(context, username, password)
  .then(() => {
    console.info(`authenticate(${username}, *****) => `);
    console.info(`access token: ${contextProperties.getAccessToken(context)}`);
    console.info(`refresh token: ${contextProperties.getRefreshToken(context)}`);
  })
  .then(oauthApi.refresh(context))
  .then(() => {
    console.info('refresh() => ');
    console.info(`access token: ${contextProperties.getAccessToken(context)}`);
    console.info(`refresh token: ${contextProperties.getRefreshToken(context)}`);
  })
  .catch(error => {
    console.log(config.apis.elite2);
    // console.log(error.data);
    // console.log(error.response);
    console.log(error.response.status);
    console.log(error.response.data);
  });

