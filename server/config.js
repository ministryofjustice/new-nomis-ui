const argv = require('minimist')(process.argv.slice(2));

const setTestDefaults = () => {
  // Setup different default values when running locally or integration tests
  // .env file still overrides.
  if (!process.env.WHEREABOUTS_UI_URL) {
    apis.whereabouts.ui_url = 'http://localhost:3002';
  }
  if (!process.env.OMIC_UI_URL) {
    apis.keyworker.ui_url = 'http://localhost:3001';
  }
};

const app = {
  port: argv.port || process.env.PORT || 3000,
  production: process.env.NODE_ENV === 'production',
  feedbackUrl: process.env.FEEDBACK_URL,
  mailTo: process.env.MAIL_TO || 'feedback@digital.justice.gov.uk',
  tokenRefreshThresholdSeconds: process.env.TOKEN_REFRESH_THRESHOLD_SECONDS || 60,
};

const analytics = {
  google_analytics_id: process.env.GOOGLE_ANALYTICS_ID || 'UA-106741063-1',
  appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'secret',
};

const hmppsCookie = {
  name: process.env.HMPPS_COOKIE_NAME || 'hmpps-session-dev',
  domain: process.env.HMPPS_COOKIE_DOMAIN || 'localhost',
  expiryMinutes: process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 20,
};

const apis = {
  oauth2: {
    url: process.env.OAUTH_ENDPOINT_URL || process.env.API_ENDPOINT_URL || 'http://localhost:9090/auth',
    timeoutSeconds: process.env.API_ENDPOINT_TIMEOUT_SECONDS || 10,
    clientId: process.env.API_CLIENT_ID || 'elite2apiclient',
    clientSecret: process.env.API_CLIENT_SECRET || 'clientsecret',
  },
  elite2: {
    url: process.env.API_ENDPOINT_URL || 'http://localhost:8080',
    timeoutSeconds: process.env.API_ENDPOINT_TIMEOUT_SECONDS || 10,
  },
  keyworker: {
    url: process.env.KEYWORKER_API_URL || 'http://localhost:8081',
    timeoutSeconds: process.env.KEYWORKER_API_TIMEOUT_SECONDS || 10,
    ui_url: process.env.OMIC_UI_URL,
  },
  whereabouts: {
    ui_url: process.env.WHEREABOUTS_UI_URL,
    ui_rollcheck_url: process.env.ESTABLISHMENT_ROLLCHECK_URL,
  },
};

module.exports = {
  app,
  analytics,
  hmppsCookie,
  apis,
  setTestDefaults,
};
