/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */
import { combineReducers } from 'redux-immutable'
import { reducer as formReducer } from 'redux-form/immutable'
import appReducer from './globalReducers/app'
import languageProviderReducer from './containers/LanguageProvider/reducer'
import authenticationReducer from './containers/Authentication/reducer'
import configReducer from './containers/ConfigLoader/reducer'
import eliteApiLoaderReducer from './containers/EliteApiLoader/reducer'
import homeReducer from './containers/HomePage/reducers'
import searchReducer from './containers/Bookings/reducers'

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    home: homeReducer,
    search: searchReducer,
    app: appReducer,
    language: languageProviderReducer,
    form: formReducer,
    authentication: authenticationReducer,
    config: configReducer,
    eliteApiLoader: eliteApiLoaderReducer,
    ...asyncReducers,
  })
}
