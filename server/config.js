const argv = require('minimist')(process.argv.slice(2));

module.exports = {
  app: {
    host: argv.host || process.env.HOST || 'localhost',
    port: argv.port || process.env.PORT || 3000,
    production: process.env.NODE_ENV === 'production',
    feedbackUrl: process.env.FEEDBACK_URL,
    useApiAuthGateway: process.env.USE_API_GATEWAY_AUTH === 'yes',
    apiGatewayKey: process.env.API_GATEWAY_PRIVATE_KEY || '',
    nomsToken: process.env.NOMS_TOKEN,
  },
  analytics: {
    google_analytics_id: process.env.GOOGLE_ANALYTICS_ID || 'UA-106741063-1',
    appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'secret',
  },
  apis: {
    elite2: {
      url: process.env.API_ENDPOINT_URL || 'http://localhost:3000',
      clientId: process.env.API_CLIENT_ID || 'elite2apiclient',
      clientSecret: process.env.API_CLIENT_SECRET || 'clientsecret',
    },
    keyworker: {
      url: process.env.KEYWORKER_API_URL,
      ui_url: process.env.OMIC_UI_URL,
    },
  },
  hmppsCookie: {
    name: process.env.HMPPS_COOKIE_NAME || 'hmpps-session-dev',
    domain: process.env.HMPPS_COOKIE_DOMAIN || 'localhost',
    expiryMinutes: process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 20,
  },
  session: {
    name: 'notm-session',
    secret: process.env.SESSION_COOKIE_SECRET || 'keyboard cat',
    expiryMinutes: process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 20,
  },
};
