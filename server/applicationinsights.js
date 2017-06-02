const appInsights = require('applicationinsights');
const appinsightsKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY || '';
appInsights.setup(appinsightsKey).start();

module.exports = appInsights;
