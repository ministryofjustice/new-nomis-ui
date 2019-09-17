import { fromJS, List, Map } from 'immutable'
import eliteApiReducer from './reducer'
import { CALC_READ_ONLY_VIEW } from '../Bookings/constants'
import { ALL_ALERT_TYPES_DATA } from './constants'
import { USER_ME } from '../Authentication/constants'

describe('EliteApiReducer reducer', () => {
  describe('user me', () => {
    it('should set roles in state', () => {
      const initialState = fromJS({ User: { Roles: { Data: {} } } })
      const state = eliteApiReducer(initialState, {
        type: USER_ME,
        payload: { user: { accessRoles: [{ role: 'BOB' }] } },
      })
      const roles = state.getIn(['User', 'Roles', 'Data'])

      expect(roles.toJS()).toEqual([{ role: 'BOB' }])
    })
  })

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
    it('should be able to edit if user can view inactive bookings and prisoner out', () => {
      const initialState = fromJS({
        User: { Roles: { Data: [{ roleCode: 'INACTIVE_BOOKINGS' }] }, CaseLoads: { Data: {} } },
        Bookings: { Details: { AB12345C: { Data: { agencyId: 'OUT' } } } },
      })
      const state = eliteApiReducer(initialState, { type: CALC_READ_ONLY_VIEW, payload: { offenderNo: 'AB12345C' } })
      const userCanEdit = state.getIn(['Bookings', 'Details', 'AB12345C', 'UserCanEdit'])

      expect(userCanEdit).toBe(true)
    })
    it('should be able to edit if user can view inactive bookings and prisoner transfer', () => {
      const initialState = fromJS({
        User: { Roles: { Data: [{ roleCode: 'INACTIVE_BOOKINGS' }] }, CaseLoads: { Data: {} } },
        Bookings: { Details: { AB12345C: { Data: { agencyId: 'TRN' } } } },
      })
      const state = eliteApiReducer(initialState, { type: CALC_READ_ONLY_VIEW, payload: { offenderNo: 'AB12345C' } })
      const userCanEdit = state.getIn(['Bookings', 'Details', 'AB12345C', 'UserCanEdit'])

      expect(userCanEdit).toBe(true)
    })
    it('should not be able to edit if user can view inactive bookings and prisoner in prison', () => {
      const initialState = fromJS({
        User: { Roles: { Data: [{ roleCode: 'INACTIVE_BOOKINGS' }] }, CaseLoads: { Data: {} } },
        Bookings: { Details: { AB12345C: { Data: { agencyId: 'LEI' } } } },
      })
      const state = eliteApiReducer(initialState, { type: CALC_READ_ONLY_VIEW, payload: { offenderNo: 'AB12345C' } })
      const userCanEdit = state.getIn(['Bookings', 'Details', 'AB12345C', 'UserCanEdit'])

      expect(userCanEdit).toBe(false)
    })
  })

  it('should return all alert types', () => {
    const state = eliteApiReducer(fromJS({}), {
      type: ALL_ALERT_TYPES_DATA,
      payload: [
        {
          domain: 'ALERT',
          code: 'S',
          description: 'Sexual Offence',
          activeFlag: 'Y',
          listSeq: 7,
          systemDataFlag: 'N',
          subCodes: undefined,
        },
        {
          domain: 'ALERT',
          code: 'T',
          description: 'Hold Against Transfer',
          activeFlag: 'N',
          listSeq: 8,
          systemDataFlag: 'N',
          subCodes: undefined,
        },
      ],
    })

    const alertTypes = state.getIn(['AlertTypes'])

    expect(alertTypes.toJS()).toEqual([
      { code: 'S', description: 'Sexual Offence' },
      { code: 'T', description: 'Hold Against Transfer' },
    ])
  })
})
