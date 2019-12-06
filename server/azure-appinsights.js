const appInsights = require('applicationinsights')
const fs = require('fs')
const config = require('./config')

module.exports = () => {
  if (config.app.production && config.analytics.appInsightsKey) {
    const packageData = JSON.parse(fs.readFileSync('./package.json'))

    appInsights
      .setup(config.analytics.appInsightsKey)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
      .start()
    appInsights.defaultClient.context.tags['ai.cloud.role'] = `${packageData.name}`
  }
}
