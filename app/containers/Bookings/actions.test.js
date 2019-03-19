import * as actions from './actions'
import * as types from './constants'

describe('Results actions', () => {
  it('should create UPDATE_PAGINATION when changing results per page', () => {
    const pagination = {
      locationPrefix: 'MDI',
      perPage: '20',
      pageNumber: '1',
      sortFields: ['lastName', 'firstName'],
      sortOrder: 'ASC',
    }
    const expectedAction = {
      payload: {
        ...pagination,
        pageNumber: 0,
        perPage: 50,
      },
      type: types.UPDATE_PAGINATION,
    }

    expect(actions.changePerPage(50, pagination)).toEqual(expectedAction)
  })
})
