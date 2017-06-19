import { fromJS, Map } from 'immutable';

import {
  SET_ASSIGNMENTS_PAGINATION,
  SET_ASSIGNMENTS_VIEW,
} from './constants';

const initialState = Map({
  pagination: Map({ perPage: 7, pageNumber: 0 }),
  view: 'List',
  sortOrder: 'TEST',
});

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ASSIGNMENTS_PAGINATION: {
      return state.set('pagination', fromJS(action.payload));
    }

    case SET_ASSIGNMENTS_VIEW: {
      const { view } = action.payload;
      const cP = state.get('pagination').toJS();
      const currentFirstId = cP.pageNumber * cP.perPage;
      let newPerPage;
      if (view === 'Grid') {
        newPerPage = 12;
      } else if (view === 'List') {
        newPerPage = 7;
      }
      const newPageNumber = Math.floor(currentFirstId / newPerPage);
      const newPagination = { perPage: newPerPage, pageNumber: newPageNumber };
      return state.set('pagination', fromJS(newPagination)).set('view', view);
    }

    default: {
      return state;
    }
  }
}

export default searchReducer;
