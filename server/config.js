const argv = require('minimist')(process.argv.slice(2))

const app = {
  port: argv.port || process.env.PORT || 3000,
  production: process.env.NODE_ENV === 'production',
  feedbackUrl: process.env.FEEDBACK_URL,
  mailTo: process.env.MAIL_TO || 'feedback@digital.justice.gov.uk',
  tokenRefreshThresholdSeconds: process.env.TOKEN_REFRESH_THRESHOLD_SECONDS || 60,
  url: process.env.NN_ENDPOINT_URL || `http://localhost:${argv.port || process.env.PORT || 3000}/`,
  iepLinkEnabled: process.env.IEP_LINK_ENABLED || false,
}

const analytics = {
  google_analytics_id: process.env.GOOGLE_ANALYTICS_ID || 'UA-106741063-1',
  appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'secret',
  googleTagManagerId: process.env.GOOGLE_TAG_MANAGER_ID,
}

const hmppsCookie = {
  name: process.env.HMPPS_COOKIE_NAME || 'hmpps-session-dev',
  domain: process.env.HMPPS_COOKIE_DOMAIN || 'localhost',
  expiryMinutes: process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 20,
  sessionSecret: process.env.SESSION_COOKIE_SECRET || 'notm-insecure-session',
}

const apis = {
  oauth2: {
    url: process.env.OAUTH_ENDPOINT_URL || 'http://localhost:9090/auth/',
    ui_url: process.env.OAUTH_ENDPOINT_UI_URL || process.env.OAUTH_ENDPOINT_URL || 'http://localhost:9090/auth/',
    timeoutSeconds: process.env.API_ENDPOINT_TIMEOUT_SECONDS || 10,
    clientId: process.env.API_CLIENT_ID || 'elite2apiclient',
    clientSecret: process.env.API_CLIENT_SECRET || 'clientsecret',
  },
  elite2: {
    url: process.env.API_ENDPOINT_URL || 'http://localhost:8080/',
    timeoutSeconds: process.env.API_ENDPOINT_TIMEOUT_SECONDS || 30,
  },
  keyworker: {
    url: process.env.KEYWORKER_API_URL || 'http://localhost:8081/',
    timeoutSeconds: process.env.KEYWORKER_API_TIMEOUT_SECONDS || 30,
    ui_url: process.env.OMIC_UI_URL || 'http://localhost:3001/',
  },
  prisonStaffHub: {
    ui_url: process.env.PRISON_STAFF_HUB_UI_URL || 'http://localhost:3002/',
  },
}

module.exports = {
  app,
  analytics,
  hmppsCookie,
  apis,
}
