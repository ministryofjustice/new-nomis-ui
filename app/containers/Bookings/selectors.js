import { createSelector } from 'reselect'
import { toFullName } from 'utils/stringUtils'

import { selectBookingDetails as selectEliteBookingDetails } from 'containers/EliteApiLoader/selectors'

import { intlSelector } from 'containers/LanguageProvider/selectors'

const selectSearch = () => state => state.get('search')

const selectQuickLookViewModel = () =>
  createSelector(selectSearch(), searchState => searchState.getIn(['details', 'quickLookViewModel']))
const selectLocations = () => createSelector(selectSearch(), searchState => searchState.getIn(['details', 'locations']))

const selectSearchResults = () => createSelector(selectSearch(), searchState => searchState.get('results').toJS())

const selectSearchQuery = () => createSelector(selectSearch(), searchState => searchState.get('query').toJS())

const selectSearchResultsPagination = () =>
  createSelector(selectSearch(), searchState => searchState.get('pagination').toJS())

const selectSearchResultsSortOrder = () => createSelector(selectSearch(), searchState => searchState.get('sortOrder'))

const selectSearchResultsV2 = () => createSelector(state => state.getIn(['search', 'results']), results => results)

const selectSearchResultsTotalRecords = () =>
  createSelector(state => state.getIn(['search', 'totalResults']), results => results)

const selectDetails = () => createSelector(selectSearch(), searchState => searchState.get('details'))

const selectKeyDatesViewModel = () =>
  createSelector(selectSearch(), searchState => searchState.getIn(['details', 'keyDatesViewModel']))

const selectError = () => createSelector(selectSearch(), searchState => searchState.getIn(['details', 'error']))

const selectShouldShowLargePhoto = () =>
  createSelector(selectSearch(), searchState => searchState.getIn(['details', 'shouldShowLargePhoto']))

const selectImageId = () => createSelector(selectSearch(), searchState => searchState.getIn(['details', 'imageId']))

const selectResultsView = () => createSelector(selectSearch(), searchState => searchState.get('resultsView'))

const selectBookingDetailsId = () => createSelector(selectSearch(), searchState => searchState.getIn(['details', 'id']))

const selectBookingDetail = () =>
  createSelector(selectEliteBookingDetails(), selectBookingDetailsId(), (bookingDetails, id) => {
    const dets = bookingDetails.get(id)
    return dets
  })

const selectName = () =>
  createSelector(selectBookingDetail(), details => {
    const { firstName, lastName } = details.get('Data').toJS()
    return toFullName({ firstName, lastName })
  })

const selectHeaderDetail = () =>
  createSelector(selectBookingDetail(), bookingDetails => bookingDetails && bookingDetails.get('Data').toJS())

const selectOffenderAgencyId = () => createSelector(selectHeaderDetail(), state => state.assignedLivingUnit.agencyId)

const selectPhysicalAttributes = () =>
  createSelector(selectBookingDetail(), bookingDetails => {
    const pcs = bookingDetails.getIn(['Data', 'physicalCharacteristics']).toJS()
    const modalGridArray = []

    const characteristicGrid = pcs.map((char, index) => {
      const { characteristic: title, detail: value } = char

      return {
        key: `${char.characteristic}${index}`,
        title,
        value,
      }
    })

    return { characteristicGrid, modalGridArray }
  })

const selectPhysicalMarks = () =>
  createSelector(selectBookingDetail(), bookingDetails => {
    const pcs = bookingDetails.getIn(['Data', 'physicalMarks']).toJS()
    const modalGridArray = []
    let imageIndex = 0

    const marksGridArray = pcs.map((mark, index) => {
      const { type, side, bodyPart, imageId, orentiation, comment, size } = mark
      const gridArray = []
      const modalGridObject = { array: [] }

      if (type) gridArray.push({ title: 'Type', value: type, key: `${type}${index}` })
      if (type) modalGridObject.array.push({ title: 'Type', value: type, key: `${type}${index}` })

      if (size) gridArray.push({ title: 'Size', value: size, key: `${size}${index}` })
      if (comment) gridArray.push({ title: 'Comment', value: comment, key: `${comment}${index}` })
      if (comment) modalGridObject.array.push({ title: 'Comment', value: comment, key: `${comment}${index}` })

      if (bodyPart) gridArray.push({ title: 'Body Part', value: bodyPart, key: `${bodyPart}${index}` })
      if (side) gridArray.push({ title: 'Side', value: side, key: `${side}${index}` })
      if (orentiation) gridArray.push({ title: 'Orientation', value: orentiation, key: `${orentiation}${index}` })
      if (imageId) {
        gridArray.push({ title: 'Visual', imageId, imageIndex, key: `${imageId}${index}` })
        imageIndex += 1
        modalGridObject.imageId = imageId
        modalGridArray.push(modalGridObject)
      }

      return gridArray
    })

    return { marksGridArray, modalGridArray }
  })

const selectAlertsPagination = () =>
  createSelector(selectDetails(), caseNotesState => caseNotesState.get('alertsPagination').toJS())

const selectCaseNotes = () => createSelector(selectDetails(), caseNotesState => caseNotesState.get('caseNotes'))

const selectCaseNotesPagination = () =>
  createSelector(selectCaseNotes(), caseNotesState => caseNotesState.get('Pagination').toJS())

const selectCaseNotesQuery = () =>
  createSelector(selectCaseNotes(), caseNotesState => caseNotesState.get('Query').toJS())

const selectCaseNotesView = () =>
  createSelector(selectCaseNotes(), caseNotesState =>
    caseNotesState.get('viewOptions').get(caseNotesState.get('viewId'))
  )

const selectCaseNotesDetailId = () =>
  createSelector(selectCaseNotes(), caseNotesState => caseNotesState.get('caseNoteDetailId'))
const selectScheduledEvents = () =>
  createSelector(
    selectDetails(),
    detailsState => (detailsState.get('scheduledEvents') && detailsState.get('scheduledEvents').toJS()) || null
  )

const selectCurrentFilter = () => createSelector(selectDetails(), detailsState => detailsState.get('currentFilter'))

export {
  selectSearch,
  selectSearchResults,
  selectSearchQuery,
  selectDetails,
  selectSearchResultsV2,
  selectSearchResultsPagination,
  selectSearchResultsSortOrder,
  selectSearchResultsTotalRecords,
  selectResultsView,
  selectBookingDetail,
  selectPhysicalAttributes,
  selectPhysicalMarks,
  selectHeaderDetail,
  selectAlertsPagination,
  selectBookingDetailsId,
  selectCaseNotesPagination,
  selectCaseNotesQuery,
  selectCaseNotesView,
  selectCaseNotesDetailId,
  selectShouldShowLargePhoto,
  selectImageId,
  selectLocations,
  intlSelector,
  selectKeyDatesViewModel,
  selectError,
  selectQuickLookViewModel,
  selectScheduledEvents,
  selectCurrentFilter,
  selectName,
  selectOffenderAgencyId,
}
