import { fromJS, Map } from 'immutable'

import { SET_ASSIGNMENTS, SET_ASSIGNMENTS_VIEW, SET_ASSIGNMENTS_ERROR } from './constants'

export const initialState = Map({
  capacity: 0,
  allocations: [],
  error: '',
})

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ASSIGNMENTS: {
      const { allocations, capacity } = action.payload

      return state
        .set('allocations', fromJS(allocations))
        .set('capacity', fromJS(capacity))
        .set('error', '')
    }

    case SET_ASSIGNMENTS_VIEW: {
      const { view } = action.payload
      return state.set('view', view)
    }

    case SET_ASSIGNMENTS_ERROR: {
      return state.set('error', action.payload)
    }

    default: {
      return state
    }
  }
}

export default searchReducer
