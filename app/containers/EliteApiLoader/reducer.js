import { fromJS, Map, Set, List } from 'immutable'

import { transform as transformOffenderDetails } from '../../helpers/dataMappers/offenderDetails'
import { Model as caseNoteModel, transform as caseNotesTransformer } from '../../helpers/dataMappers/caseNotes'

import {
  BOOKINGS,
  LOCATIONS,
  CASENOTETYPES,
  OFFICERS,
  USER,
  ALLCASENOTETYPESUBTYPEDATA,
  ALL_ALERT_TYPES_DATA,
  APPOINTMENT,
} from './constants'
import { CALC_READ_ONLY_VIEW } from '../Bookings/constants'
import { USER_ME } from '../Authentication/constants'

export const initialState = Map({
  Bookings: Map({
    Search: Map(),
    Summaries: Map(),
    Details: Map(),
  }),
  Images: Map(),
  Locations: fromJS({
    Status: { Type: 'NOT SET' },
    MetaData: {
      TotalRecords: 0,
    },
    ids: {},
    SelectList: [{ value: 'Loading Locations...' }],
  }),
  AlertTypes: List(),
  CaseNoteTypes: Map(),
  CaseNoteTypesSelect: Map({ Types: Set([]), TypeList: List([]) }),
  AllCaseNoteFilters: Map({
    Types: [],
    SubTypes: [],
  }),
  Officers: Map(),
  User: Map({
    CaseLoads: List(),
    CaseNoteTypes: [],
    CaseNoteSubTypes: [],
  }),
})

function EliteApiReducer(state = initialState, action) {
  switch (action.type) {
    case BOOKINGS.CLEAR: {
      return state.set(
        'Bookings',
        Map({
          Search: Map({}),
          Summaries: Map({}),
          Details: Map({}),
        })
      )
    }

    case BOOKINGS.DETAILS.SUCCESS: {
      const key = ['Bookings', 'Details', action.payload.offenderNo, 'Data']
      return state.setIn(key, transformOffenderDetails(fromJS(action.payload)))
    }

    case BOOKINGS.DETAILS.ERROR: {
      const { error } = action.payload

      const key = ['Bookings', 'Details', action.payload.offenderNo]

      return state.deleteIn(key).setIn(['Bookings', 'Details', 'LoadingStatus'], { Type: 'ERROR', error })
    }

    case BOOKINGS.ALERTS.SUCCESS: {
      const { offenderNo, results, meta } = action.payload

      return state
        .setIn(['Bookings', 'Details', offenderNo, 'Alerts', 'MetaData', 'TotalRecords'], meta.totalRecords)
        .setIn(['Bookings', 'Details', offenderNo, 'Alerts', 'items'], fromJS(results))
    }

    case BOOKINGS.CASENOTES.RESET: {
      const { offenderNo } = action.payload
      return state.setIn(['Bookings', 'Details', offenderNo, 'CaseNotes'], caseNoteModel)
    }

    case BOOKINGS.CASENOTES.SET_PAGINATION: {
      const { offenderNo, pagination } = action.payload

      return state.setIn(['Bookings', 'Details', offenderNo, 'CaseNotes', 'pagination'], fromJS(pagination))
    }

    case BOOKINGS.CASENOTES.SUCCESS: {
      const { offenderNo } = action.payload
      const path = ['Bookings', 'Details', offenderNo, 'CaseNotes']

      return state.setIn(path, caseNotesTransformer(fromJS(action.payload)))
    }

    case BOOKINGS.CASENOTES.VIEW_DETAILS: {
      const { offenderNo, caseNoteId } = action.payload

      const rootPath = ['Bookings', 'Details', offenderNo, 'CaseNotes']

      return state
        .setIn([...rootPath, 'caseNoteDetailId'], caseNoteId)
        .setIn([...rootPath, 'selectedViewOption'], 'details')
    }

    case LOCATIONS.LOADING: {
      return state.setIn(['Locations', 'Status', 'Type'], 'LOADING')
    }

    case LOCATIONS.SUCCESS: {
      const locs = action.payload.locations
      const SelectList = Object.keys(locs).map(locId => ({ value: locId, label: locs[locId].description }))

      return state
        .setIn(['Locations', 'ids'], fromJS(action.payload.locations))
        .setIn(['Locations', 'Status', 'Type'], 'SUCCESS')
        .setIn(['Locations', 'SelectList'], List(SelectList))
    }

    case OFFICERS.LOADING: {
      return state.setIn(['Officers', action.payload.officerKey, 'Status', 'Type'], 'LOADING')
    }

    case OFFICERS.SUCCESS: {
      return state.updateIn(['Officers', action.payload.officerKey], user =>
        user.setIn(['Status', 'Type'], 'SUCCESS').set('Data', action.payload.data)
      )
    }

    case OFFICERS.ERROR: {
      return state.setIn(
        ['Officers', action.payload.officerKey, 'Status'],
        fromJS({ Type: 'ERROR', Error: action.payload.error })
      )
    }

    case CASENOTETYPES.PRELOAD.LOADING: {
      return state
    }

    case CASENOTETYPES.PRELOAD.SUCCESS: {
      const { types, subTypes } = action.payload
      const Types = types.map(x => ({ label: x.description, value: x.code }))
      const SubTypes = subTypes.map(x => ({
        value: x.source === 'OCNS' ? `XXX_${x.code}` : x.code,
        label: x.description,
        parent: x.parentCode,
      }))

      return state.setIn(['User', 'CaseNoteTypes'], Types).setIn(['User', 'CaseNoteSubTypes'], SubTypes)
    }

    case USER.CASELOADS.LOADING: {
      return state.setIn(['User', 'CaseLoads'], fromJS({ Status: { Type: 'LOADING' } }))
    }

    case USER.CASELOADS.SUCCESS: {
      return state.setIn(['User', 'CaseLoads'], fromJS({ Status: { Type: 'SUCCESS' }, Data: action.payload.caseloads }))
    }

    case USER.CASELOADS.ERROR: {
      return state.setIn(['User', 'CaseLoads'], fromJS({ Status: { Type: 'ERROR', Error: action.payload.error } }))
    }

    case USER_ME: {
      return state.setIn(
        ['User', 'Roles'],
        fromJS({ Status: { Type: 'SUCCESS' }, Data: action.payload.user.accessRoles })
      )
    }

    case ALLCASENOTETYPESUBTYPEDATA: {
      const { types, subTypes } = action.payload
      const TypeMap = {}
      const SubTypeMap = {}
      const Types = types.map(x => {
        TypeMap[x.code] = x.description
        return { label: x.description, value: x.code }
      })
      const SubTypes = subTypes.reduce(
        (arr, sT) => arr.concat(sT.map(x => ({ label: x.description, value: x.code, parent: x.parentCode }))),
        []
      )
      SubTypes.forEach(x => {
        if (SubTypeMap[x.value]) {
          console.log('multiple subtypes same name...', SubTypeMap[x.value], x.label) // eslint-disable-line
        }
        SubTypeMap[x.value] = x.label
      })

      return state
        .set('AllCaseNoteFilters', Map({ Types, SubTypes }))
        .set('CaseNoteTypes', Map({ Types: TypeMap, SubTypes: SubTypeMap }))
    }

    case ALL_ALERT_TYPES_DATA: {
      const alertTypes = action.payload.map(({ code, description }) => ({
        code,
        description,
      }))
      return state.set('AlertTypes', fromJS(alertTypes))
    }

    case APPOINTMENT.SET_VIEW_MODEL: {
      return state.set('AppointmentTypesAndLocations', fromJS(action.payload))
    }

    case APPOINTMENT.SET_EXISTING_EVENTS: {
      return state.set('ExistingEvents', fromJS(action.payload))
    }

    case CALC_READ_ONLY_VIEW: {
      const { offenderNo } = action.payload
      const caseloads = state.getIn(['User', 'CaseLoads', 'Data'])
      const roles = state.getIn(['User', 'Roles', 'Data'])
      const canViewInactivePrisoner = roles && roles.some(r => r.get('roleCode') === 'INACTIVE_BOOKINGS')

      const offenderAgency = state.getIn(['Bookings', 'Details', offenderNo, 'Data', 'agencyId'])
      const caseLoad = caseloads.find(x => x.get('caseLoadId') === offenderAgency)

      const offenderInCaseload = caseLoad !== undefined
      const userCanEdit = (canViewInactivePrisoner && ['OUT', 'TRN'].includes(offenderAgency)) || offenderInCaseload

      return state
        .setIn(['Bookings', 'Details', offenderNo, 'UserCanEdit'], userCanEdit)
        .setIn(['Bookings', 'Details', offenderNo, 'OffenderInCaseload'], offenderInCaseload)
    }

    default: {
      return state
    }
  }
}

export default EliteApiReducer
