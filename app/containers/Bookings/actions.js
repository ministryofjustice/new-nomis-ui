/*
 *
 * Authentication actions
 *
 */

import {
  SEARCH,
} from './constants';

export function search(searchObj) {
  return {
    type: SEARCH,
    searchObj,
  };
}
