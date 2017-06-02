const appInsights = require('applicationinsights');
const appinsightsKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'secretkey';
appInsights.setup(appinsightsKey).start();

module.exports = appInsights;
