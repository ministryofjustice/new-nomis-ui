/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux'
import { fromJS } from 'immutable'
import { routerMiddleware } from 'react-router-redux'
import createDebounce from 'redux-debounce'
import createSagaMiddleware from 'redux-saga'
import { formActionSaga } from 'redux-form-saga'

import createReducer from './reducers'

// Import persisted localStorage state
import persistedState from './helpers/persistedState'
import authenticationSagas from './containers/Authentication/sagas'
import eliteApiLoaderSagas from './containers/EliteApiLoader/sagas'
import assignmentsSagas from './containers/Assignments/sagas'

const sagaMiddleware = createSagaMiddleware()

const debounceConfig = {
  // Suggest no lower than 250 otherwise debounce will be ineffective
  simple: 250,
}

const debouncer = createDebounce(debounceConfig)

export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [debouncer, sagaMiddleware, routerMiddleware(history)]

  /**
   * Development only middleware
   */
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production') {
    /* eslint-disable global-require */

    // Bug catching, freeze the redux store from mutation during development
    const freeze = require('redux-freeze')
    middlewares.push(freeze)

    // Console logging of redux actions
    // const logger = require('redux-logger')({
    //   collapsed: true,
    //   colors: {
    //     title: () => 'darkslategray',
    //     prevState: () => 'darkviolet',
    //     action: () => 'darkcyan',
    //     nextState: () => 'green',
    //     error: () => 'firebrick',
    //   },
    //   predicate: () => true, // Turn logger on/off easily
    // });
    // middlewares.push(logger);

    /* eslint-enable */
  }

  const enhancers = [applyMiddleware(...middlewares)]

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ /* istanbul ignore next */
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ /* istanbul ignore next */
      : compose
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    fromJS({
      ...initialState,
      ...persistedState.load(),
    }),
    composeEnhancers(...enhancers)
  )

  // Extensions
  store.runSaga = sagaMiddleware.run
  store.asyncReducers = {} // Async reducer registry

  // set up auth sagas here so they don't get hot reloaded...
  authenticationSagas.map(store.runSaga)
  store.runSaga(formActionSaga)

  // set up eliteApiSagas
  eliteApiLoaderSagas.map(store.runSaga)

  // set up assignmentsSagas
  assignmentsSagas.map(store.runSaga)

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore if */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then(reducerModule => {
        const createReducers = reducerModule.default
        const nextReducers = createReducers(store.asyncReducers)

        store.replaceReducer(nextReducers)
      })
    })
  }

  return store
}
