import { fromJS } from 'immutable'
import { push } from 'react-router-redux'

// Actions
const SET_DEVICE_FORMAT = 'globalReducer/app/SET_DEVICE_FORMAT'
const SET_MOBILE_MENU_OPEN = 'globalReducer/app/SET_MOBILE_MENU_OPEN'
const SET_MODAL_OPEN = 'globalReducer/app/SET_MODAL_OPEN'
const SET_MODAL_DATA = 'globalReducer/app/SET_MODAL_DATA'
const SET_SEARCH_CONTEXT = 'globalReducer/app/SET_SEARCH_CONTEXT'
const SET_SPINNER_VISIBILITY = 'globalReducer/app/SET_SPINNER_VISIBILITY'
const SET_TERMS_VISIBILITY = 'globalReducer/app/SET_TERMS_VISIBILITY'

const SET_APP_CONFIG = '/globalReducer/app/SET_CONFIG'

// Initial State
const initialState = fromJS({
  // desktop or mobile
  deviceFormat: 'desktop',
  mobileMenuOpen: false,
  modalOpen: false,
  modalData: {
    title: 'title',
    body: 'body',
  },
  searchContext: 'none',
  shouldShowSpinner: false,
  shouldShowTerms: false,
})

// Reducer
export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DEVICE_FORMAT:
      return state.set('deviceFormat', action.payload)
    case SET_MOBILE_MENU_OPEN:
      return state.set('mobileMenuOpen', action.payload)
    case SET_MODAL_OPEN:
      return state.set('modalOpen', action.payload)
    case SET_MODAL_DATA:
      return state.set('modalData', action.payload)
    case SET_SEARCH_CONTEXT:
      return state.set('searchContext', action.payload)
    case SET_SPINNER_VISIBILITY:
      return state.set('shouldShowSpinner', action.payload)
    case SET_TERMS_VISIBILITY:
      return state.set('shouldShowTerms', action.payload)
    case SET_APP_CONFIG:
      Object.keys(action.payload).forEach(name => {
        // eslint-disable-next-line
        state = state.set(name, action.payload[name])
      })
      return state
    default:
      return state
  }
}

// Action Creators
export const setDeviceFormat = format => ({
  type: SET_DEVICE_FORMAT,
  payload: format,
})

export const setAppConfig = config => ({
  type: SET_APP_CONFIG,
  payload: config,
})

export const setMenuOpen = bool => ({
  type: SET_MOBILE_MENU_OPEN,
  payload: bool,
})

export const setModalOpen = bool => ({
  type: SET_MODAL_OPEN,
  payload: bool,
})

export const setModalData = obj => ({
  type: SET_MODAL_DATA,
  payload: obj,
})

export const setSearchContext = context => ({
  type: SET_SEARCH_CONTEXT,
  payload: context,
})

export const showSpinner = () => ({
  type: SET_SPINNER_VISIBILITY,
  payload: true,
})

export const hideSpinner = () => ({
  type: SET_SPINNER_VISIBILITY,
  payload: false,
})

export const showTerms = () => ({
  type: SET_TERMS_VISIBILITY,
  payload: true,
})

export const hideTerms = () => ({
  type: SET_TERMS_VISIBILITY,
  payload: false,
})

export const navigateTo = url => push(url)
