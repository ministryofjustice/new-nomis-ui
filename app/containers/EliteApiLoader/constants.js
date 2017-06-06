
// Preload Location &  Alert Type data

export const PRELOADDATA = {
  BASE: 'app/eliteApiLoader/preloadData',
};

// Bookings

// Bookings/Search
export const BOOKINGS = {
  SEARCH: {
    BASE: 'app/eliteApiLoader/bookings/SEARCH',
    LOADING: 'app/eliteApiLoader/bookings/SEARCH/loading',
    SUCCESS: 'app/eliteApiLoader/bookings/SEARCH/success',
    ERROR: 'app/eliteApiLoader/bookings/SEARCH/error',
  },
  DETAILS: {
    BASE: 'app/eliteApiLoader/bookings/DETAILS',
    LOADING: 'app/eliteApiLoader/bookings/DETAILS/loading',
    SUCCESS: 'app/eliteApiLoader/bookings/DETAILS/success',
    ERROR: 'app/eliteApiLoader/bookings/DETAILS/error',
  }, // simple to dispatch action, sub-actions: LOADING/SUCCESS/ERROR
  // ALIASES: {
  //   BASE: 'app/eliteApiLoader/bookings/ALIASES',
  //   LOADING: 'app/eliteApiLoader/bookings/ALIASES/loading',
  //   SUCCESS: 'app/eliteApiLoader/bookings/ALIASES/success',
  //   ERROR: 'app/eliteApiLoader/bookings/ALIASES/error',
  // },
};

// Images
export const IMAGES = {
  BASE: 'app/eliteApiLoader/IMAGES',
  LOADING: 'app/eliteApiLoader/IMAGES/loading',
  SUCCESS: 'app/eliteApiLoader/IMAGES/success',
  ERROR: 'app/eliteApiLoader/IMAGES/error',
};

// Locations
export const LOCATIONS = {
  BASE: 'app/eliteApiLoader/LOCATIONS',
  LOADING: 'app/eliteApiLoader/LOCATIONS/loading',
  SUCCESS: 'app/eliteApiLoader/LOCATIONS/success',
  ERROR: 'app/eliteApiLoader/LOCATIONS/error',
};

// AlertTypes
export const ALERTTYPES = {
  BASE: 'app/eliteApiLoader/ALERTTYPES',
  LOADING: 'app/eliteApiLoader/ALERTTYPES/loading',
  SUCCESS: 'app/eliteApiLoader/ALERTTYPES/success',
  ERROR: 'app/eliteApiLoader/ALERTTYPES/error',
};
