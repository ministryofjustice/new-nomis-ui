import * as actions from './actions'
import * as types from './constants'

describe('Results actions', () => {
  it('should create UPDATE_PAGINATION when changing offender results per page', () => {
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

  it('should create CASE_NOTE_FILTER.BASE when changing case note results per page', () => {
    const offenderNo = 'ABC123'
    const query = {
      perPage: '20',
      pageNumber: '0',
      type: 'ACHIEVEMENTS',
      subType: '',
      startDate: '01/02/2019',
      endDate: '',
    }
    const expectedAction = {
      payload: {
        offenderNo,
        query: {
          ...query,
          pageNumber: 0,
          perPage: 50,
        },
      },
      type: types.CASE_NOTE_FILTER.BASE,
    }

    expect(actions.updateCaseNoteResultsPerPage(offenderNo, 50, query)).toEqual(expectedAction)
  })
})
