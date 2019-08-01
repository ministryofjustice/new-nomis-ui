import { fromJS } from 'immutable'
import eliteApiReducer from './reducer'
import { CALC_READ_ONLY_VIEW } from '../Bookings/constants'

describe('EliteApiReducer reducer', () => {
  describe('calculate read only view', () => {
    it('should not be able to edit if booking not found', () => {
      const initialState = fromJS({ User: { CaseLoads: { Data: {} } } })
      const state = eliteApiReducer(initialState, { type: CALC_READ_ONLY_VIEW, payload: { offenderNo: 'AB12345C' } })
      const userCanEdit = state.getIn(['Bookings', 'Details', 'AB12345C', 'UserCanEdit'])

      expect(userCanEdit).toBe(false)
    })
    it('should be able to edit if offender in case load', () => {
      const initialState = fromJS({
        User: { CaseLoads: { Data: [{ caseLoadId: 'MRI' }, { caseLoadId: 'BOB' }] } },
        Bookings: { Details: { AB12345C: { Data: { agencyId: 'BOB' } } } },
      })
      const state = eliteApiReducer(initialState, { type: CALC_READ_ONLY_VIEW, payload: { offenderNo: 'AB12345C' } })
      const userCanEdit = state.getIn(['Bookings', 'Details', 'AB12345C', 'UserCanEdit'])

      expect(userCanEdit).toBe(true)
    })
  })
})
