/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable */
import '!file-loader?name=[name].[ext]!./favicon.ico'
import '!file-loader?name=[name].[ext]!./manifest.json'
import 'file-loader?name=[name].[ext]!./.htaccess'
/* eslint-enable */

// https://babeljs.io/docs/en/babel-polyfill
import '@babel/polyfill'

// Import all the third party stuff
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, Switch } from 'react-router-dom'

import App from './containers/App'
import ScrollToTop from './components/ScrollToTop'

// Import Language Provider
import LanguageProvider from './containers/LanguageProvider'

// Import reset css
import 'sanitize.css/sanitize.css'
import './app.scss'

import configureStore from './store'

import registerSessionTimeoutHandler from './utils/sessionTimeoutHandler'
import updateApplicationWatcher from './utils/update-application-watcher'

// Import i18n messages
import { translationMessages } from './translations/i18n'
import routes from './routes'
import history from './history'
import IEPContainer from './containers/IEPContainer'

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = {}
const store = configureStore(initialState)

registerSessionTimeoutHandler(store)
updateApplicationWatcher()

const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <Router history={history}>
          <Switch>
            <Route exact path="/iep-slip" render={() => <IEPContainer />} />
            <ScrollToTop>
              <App routes={routes} />
            </ScrollToTop>
          </Switch>
        </Router>
      </LanguageProvider>
    </Provider>,
    document.getElementById('app')
  )
}

// Hot reloadable translation json files
if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept('./translations/i18n', () => {
    render(translationMessages)
  })
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'))
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err
    })
} else {
  render(translationMessages)
}
