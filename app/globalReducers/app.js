import { fromJS } from 'immutable';

// Actions
const SET_DEVICE_FORMAT = 'globalReducer/app/SET_DEVICE_FORMAT';
const SET_MOBILE_MENU_OPEN = 'globalReducer/app/SET_MOBILE_MENU_OPEN';
const SET_MODAL_OPEN = 'globalReducer/app/SET_MODAL_OPEN';
const SET_MODAL_DATA = 'globalReducer/app/SET_MODAL_DATA';
const SET_SEARCH_CONTEXT = 'globalReducer/app/SET_SEARCH_CONTEXT';
const SET_SPINNER_VISIBILITY = 'globalReducer/app/SET_SPINNER_VISIBILITY';

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
});

// Reducer
export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DEVICE_FORMAT:
      return state
        .set('deviceFormat', action.payload);
    case SET_MOBILE_MENU_OPEN:
      return state
        .set('mobileMenuOpen', action.payload);
    case SET_MODAL_OPEN:
      return state
        .set('modalOpen', action.payload);
    case SET_MODAL_DATA:
      return state
        .set('modalData', action.payload);
    case SET_SEARCH_CONTEXT:
      return state
        .set('searchContext', action.payload);
    case SET_SPINNER_VISIBILITY: 
      return state.set('shouldShowSpinner', action.payload);
    default:
      return state;
  }
}

// Action Creators
export const setDeviceFormat = (format) => ({
  type: SET_DEVICE_FORMAT,
  payload: format,
});

export const setMobileMenuOpen = (bool) => ({
  type: SET_MOBILE_MENU_OPEN,
  payload: bool,
});

export const setModalOpen = (bool) => ({
  type: SET_MODAL_OPEN,
  payload: bool,
});

export const setModalData = (obj) => ({
  type: SET_MODAL_DATA,
  payload: obj,
});

export const setSearchContext = (context) => ({
  type: SET_SEARCH_CONTEXT,
  payload: context,
});

export const showSpinner = () => ({
  type: SET_SPINNER_VISIBILITY,
  payload: true,
});

export const hideSpinner = () => ({
  type: SET_SPINNER_VISIBILITY,
  payload: false,
});