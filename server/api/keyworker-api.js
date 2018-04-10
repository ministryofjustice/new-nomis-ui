const retry = require('./retry');
const url = require('url');
const config = require('../config');

const baseUrl = config.apis.keyworker.url;

const getPrisonMigrationStatus = (req, res, prisonId) => 
    retry.getRequest({ req, res, disableGatewayMode: true, url: url.resolve(baseUrl, `key-worker/prison/${prisonId}`) });

const getAssignedOffenders = (req,res, staffId, prisonId) =>
    retry.getRequest({ req, res, disableGatewayMode: true, url: url.resolve(baseUrl, `key-worker/${staffId}/prison/${prisonId}/offenders`) });

const service = {
  getPrisonMigrationStatus,
  getAssignedOffenders,
};

module.exports = service;