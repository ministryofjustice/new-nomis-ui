import { createSelector } from 'reselect'
import { fromJS } from 'immutable'
import {
  selectBookingDetail,
  selectCaseNotesPagination,
  selectCaseNotesQuery,
  selectCaseNotesDetailId,
} from '../../selectors'
import { paginationHash, queryHash } from '../../../EliteApiLoader/helpers'

const selectCaseNotesObject = () => createSelector(selectBookingDetail(), details => details.get('CaseNotes'))

const selectCaseNotesQueryObj = () =>
  createSelector(selectCaseNotesObject(), selectCaseNotesQuery(), (caseNotes, query) =>
    caseNotes && caseNotes.getIn ? caseNotes.getIn(['Query', queryHash(query)]) : undefined
  )

const selectCaseNotesPaginationItem = () =>
  createSelector(selectCaseNotesQueryObj(), selectCaseNotesPagination(), (caseNotes, pagination) => {
    const thisPageOfCaseNotes = caseNotes ? caseNotes.getIn(['Paginations', paginationHash(pagination)]) : undefined
    // Setting some defaults in this selector... maybe this is bad form.
    return thisPageOfCaseNotes || fromJS({ Status: { Type: 'Not Even Loading' }, items: [] })
  })

const selectCaseNotesStatus = () =>
  createSelector(selectCaseNotesPaginationItem(), caseNotesState => caseNotesState.get('Status').toJS())

const selectCaseNoteTypeDetails = () => state => state.getIn(['eliteApiLoader', 'CaseNoteTypes'])

const selectCaseNotes = () =>
  createSelector(selectCaseNotesPaginationItem(), selectCaseNoteTypeDetails(), (caseNotesState, caseNoteTypeDetails) =>
    caseNotesState.get('items').map(caseNote => {
      const typeData = caseNoteTypeDetails.getIn([caseNote.get('source'), 'Data', caseNote.get('type'), 'Data'])
      const subTypeData = caseNoteTypeDetails.getIn([
        caseNote.get('source'),
        'Data',
        caseNote.get('type'),
        'SubTypes',
        caseNote.get('subType'),
        'Data',
      ])
      return caseNote.set('typeData', typeData).set('subTypeData', subTypeData)
    })
  )

const selectTotalCaseNotes = () =>
  createSelector(selectCaseNotesQueryObj(), caseNotes =>
    caseNotes ? caseNotes.getIn(['MetaData', 'TotalRecords']) : 0
  )

const selectCaseNoteDetails = () =>
  createSelector(selectCaseNotesDetailId(), selectCaseNotes(), (caseNoteId, caseNotes) => {
    if (!caseNoteId) return {}
    const caseNoteDets = caseNotes.filter(caseNote => caseNote.get('caseNoteId') === caseNoteId)
    return caseNoteDets.get(0)
  })

const selectCaseNoteTypeSelect = () => state => state.getIn(['eliteApiLoader', 'AllCaseNoteFilters', 'Types'])
const selectCaseNoteSubTypeSelect = () => state => state.getIn(['eliteApiLoader', 'AllCaseNoteFilters', 'SubTypes'])

const caseNoteFilterSelectInfo = () =>
  createSelector(selectCaseNoteTypeSelect(), selectCaseNoteSubTypeSelect(), (type, subType) => ({ type, subType }))

export { selectCaseNotes, selectCaseNotesStatus, selectTotalCaseNotes, selectCaseNoteDetails, caseNoteFilterSelectInfo }
