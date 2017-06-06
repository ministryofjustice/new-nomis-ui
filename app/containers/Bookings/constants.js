/*
 *
 * Booking constants
 *
 */

export const SEARCH = 'app/search/SEARCH';
export const SEARCH_LOADING = 'app/search/SEARCH/loading';
export const SEARCH_SUCCESS = 'app/search/SEARCH/success';
export const SEARCH_ERROR = 'app/search/SEARCH/error';

export const VIEW_DETAILS = 'app/bookings/details/view';
export const SET_DETAILS = 'app/bookings/details/set';
export const SET_DETAILS_TAB = 'app/bookings/details/tab/set';

export const DETAILS_ERROR = 'app/bookings/details/error';

export const SET_PAGINATION = 'app/bookings/search/results/pagination/set';
export const UPDATE_PAGINATION = 'app/bookings/search/results/pagination/update';

export const SET_RESULTS_VIEW = 'app/bookings/search/results/viewFormat';
export const UPDATE_RESULTS_VIEW = 'app/bookings/search/results/viewFormat/update';

/*
{
  type: 'app/bookings/search/results/pagination/update',
  payload: {perPage:15, pageNumber: 1}
}
*/
