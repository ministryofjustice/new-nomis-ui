import { createSelector } from 'reselect';
import { toFullName } from 'utils/stringUtils';

import {
  selectBookingDetails as selectEliteBookingDetails,
} from 'containers/EliteApiLoader/selectors';

import { intlSelector } from 'containers/LanguageProvider/selectors';

const selectSearch = () => (state) => state.get('search');

const selectQuickLookViewModel = () => createSelector(
  selectSearch(),
  (searchState) => searchState.getIn(['details','quickLookViewModel'])
);
const selectLocations = () => createSelector(
  selectSearch(),
  (searchState) => searchState.getIn(['details', 'locations']).toJS()
);

const selectSearchResults = () => createSelector(
  selectSearch(),
  (searchState) => searchState.get('results').toJS()
);

const selectSearchQuery = () => createSelector(
  selectSearch(),
  (searchState) => searchState.get('query').toJS()
);

const selectSearchResultsPagination = () => createSelector(
  selectSearch(),
  (searchState) => searchState.get('pagination').toJS()
);

const selectSearchResultsSortOrder = () => createSelector(
  selectSearch(),
  (searchState) => searchState.get('sortOrder')
);

const selectSearchResultsV2 = () => createSelector(
  (state) => state.getIn(['search', 'results']).toJS(),
  (results) => results
);

const selectSearchResultsTotalRecords = () => createSelector(
  (state) => state.getIn(['search', 'totalResults']),
  (results) => results
);

const selectDetails = () => createSelector(
  selectSearch(),
  (searchState) => searchState.get('details')
);

const selectKeyDatesViewModel = () => createSelector(
  selectSearch(),
  (searchState) => searchState.getIn(['details','keyDatesViewModel'])
);

const selectError = () => createSelector(
  selectSearch(),
  (searchState) => searchState.getIn(['details','error'])
);

const selectShouldShowLargePhoto = () => createSelector(
   selectSearch(),
   (searchState) => searchState.getIn(['details', 'shouldShowLargePhoto'])
);

const selectImageId = () => createSelector(
   selectSearch(),
   (searchState) => searchState.getIn(['details', 'imageId'])
);

const selectResultsView = () => createSelector(
  selectSearch(),
  (searchState) => searchState.get('resultsView')
);

const selectBookingDetailsId = () => createSelector(
  selectSearch(),
  (searchState) => searchState.getIn(['details', 'id'])
);

const selectBookingDetail = () => createSelector(
  selectEliteBookingDetails(),
  selectBookingDetailsId(),
  (bookingDetails, id) => {
    const dets = bookingDetails.get(id);
    return dets;
  }
);

const selectName = () => createSelector(
  selectBookingDetail(),
  (details) => {
    const { firstName, lastName } = details.get('Data').toJS();
    return toFullName({ firstName, lastName });
  }
)

const selectHeaderDetail = () => createSelector(
  selectBookingDetail(),
  (bookingDetails) => {
    const data = bookingDetails.get('Data').toJS();
    return data;
  }
);

const selectCurrentDetailTabId = () => createSelector(
  selectDetails(),
  (detailsState) => detailsState.get('activeTabId')
);

const selectOffenderDetails = () => createSelector(
  selectBookingDetail(),
  intlSelector(),
  (bookingDetails, { intl }) => {
    const dateOfBirth = intl.formatDate(Date.parse(bookingDetails.getIn(['Data', 'dateOfBirth'])));
    const age = bookingDetails.getIn(['Data', 'age']);
    const religion = bookingDetails.getIn(['Data', 'religion']);
    const ethnicity = bookingDetails.getIn(['Data', 'physicalAttributes', 'ethnicity']);
    const gender = bookingDetails.getIn(['Data', 'physicalAttributes', 'gender']);

    const assessments = bookingDetails.getIn(['Data', 'assessments']).map((ass) => {
      const value = ass.get('classification');
      const code = ass.get('assessmentCode');
      const title = ass.get('assessmentDesc');
      return { key: [value, code, title].join('-'), title, value };
    });
    const aliases = bookingDetails.getIn(['Data', 'aliases']).toJS();
    const physicalAttributes = bookingDetails.getIn(['Data', 'physicalAttributes']).toJS();
    const physicalMarks = bookingDetails.getIn(['Data','physicalMarks']).toJS();
    const physicalCharacteristics = bookingDetails.getIn(['Data','physicalCharacteristics']).toJS();
    const activeAlertCount = bookingDetails.getIn(['Data','activeAlertCount']);
    const inactiveAlertCount = bookingDetails.getIn(['Data','inactiveAlertCount']);

    return {
      dateOfBirth,
      age,
      religion,
      gender,
      ethnicity,
      assessments,
      aliases,
      physicalAttributes,
      physicalMarks,
      physicalCharacteristics,
      activeAlertCount,
      inactiveAlertCount,
    }
  }
);

const selectOffenderDetailsMobile = () => createSelector(
  selectBookingDetail(),
  intlSelector(),
  (bookingDetails, { intl }) => {
    // Mash data into what is needed for the DataGridViewComponent.
    // date of birth
    const dateOfBirth = intl.formatDate(Date.parse(bookingDetails.getIn(['Data', 'dateOfBirth'])));
    // age
    const age = bookingDetails.getIn(['Data', 'age']);
    // gender
    const gender = bookingDetails.getIn(['Data', 'physicalAttributes', 'gender']);
    // categorisation
    // csra
    const ethnicity = bookingDetails.getIn(['Data', 'physicalAttributes', 'ethnicity']);

    const personalGrid = [{
      key: 'dateOfBirth',
      title: 'Date of birth',
      value: dateOfBirth,
    }, {
      key: 'age',
      title: 'Age',
      value: age.toString(),
    },
    {
      key: 'gender',
      title: 'Gender',
      value: gender,
    },
    {
      key: 'ethnicity',
      title: 'Ethnicity',
      value: ethnicity,
    },
    ];

    const aliases = bookingDetails.getIn(['Data', 'aliases']).toJS();

    const aliasGrid = aliases.map((alias, index) => {
      //eslint-disable-next-line
      const { firstName, lastName, age: aliasAge, ethnicity, nameType } = alias;
      const name = toFullName({ firstName, lastName });
      return { key: `${firstName + lastName + aliasAge + ethnicity + nameType + index}`, title: nameType, values: [{ name }] };
    });

    return {
      personalGrid,
      aliasGrid,
    };
  }
);

const selectPhysicalAttributes = () => createSelector(
  selectBookingDetail(),
  (bookingDetails) => {
    const pcs = bookingDetails.getIn(['Data', 'physicalCharacteristics']).toJS();
    const modalGridArray = [];

    const characteristicGrid = pcs.map((char, index) => {
      const { characteristic: title, detail: value } = char;

      return {
        key: `${char.characteristic}${index}`,
        title,
        value,
      };
    });

    return { characteristicGrid, modalGridArray };
  }
);

const selectPhysicalMarks = () => createSelector(
  selectBookingDetail(),
  (bookingDetails) => {
    const pcs = bookingDetails.getIn(['Data', 'physicalMarks']).toJS();
    const modalGridArray = [];
    let imageIndex = 0;

    const marksGridArray = pcs.map((mark, index) => {
      const { type, side, bodyPart, imageId, orentiation, comment, size } = mark;
      const gridArray = [];
      const modalGridObject = { array: [] };

      if (type) gridArray.push({ title: 'Type', value: type, key: `${type}${index}` });
      if (type) modalGridObject.array.push({ title: 'Type', value: type, key: `${type}${index}` });

      if (size) gridArray.push({ title: 'Size', value: size, key: `${size}${index}` });
      if (comment) gridArray.push({ title: 'Comment', value: comment, key: `${comment}${index}` });
      if (comment) modalGridObject.array.push({ title: 'Comment', value: comment, key: `${comment}${index}` });

      if (bodyPart) gridArray.push({ title: 'Body Part', value: bodyPart, key: `${bodyPart}${index}` });
      if (side) gridArray.push({ title: 'Side', value: side, key: `${side}${index}` });
      if (orentiation) gridArray.push({ title: 'Orientation', value: orentiation, key: `${orentiation}${index}` });
      if (imageId) {
        gridArray.push({ title: 'Visual', imageId, imageIndex, key: `${imageId}${index}` });
        imageIndex += 1;
        modalGridObject.imageId = imageId;
        modalGridArray.push(modalGridObject);
      }

      return gridArray;
    });

    return { marksGridArray, modalGridArray };
  });

const selectAlertsPagination = () => createSelector(
  selectDetails(),
  (caseNotesState) => caseNotesState.get('alertsPagination').toJS()
);

const selectCaseNotes = () => createSelector(
  selectDetails(),
  (caseNotesState) => caseNotesState.get('caseNotes')
);

const selectDisplayAmendCaseNoteModal = () => createSelector(
  selectCaseNotes(),
  (caseNoteState) => caseNoteState.get('amendCaseNoteModal')
);

const selectCaseNotesPagination = () => createSelector(
  selectCaseNotes(),
  (caseNotesState) => caseNotesState.get('Pagination').toJS()
);

const selectCaseNotesQuery = () => createSelector(
  selectCaseNotes(),
  (caseNotesState) => caseNotesState.get('Query').toJS()
);

const selectCaseNotesView = () => createSelector(
  selectCaseNotes(),
  (caseNotesState) => caseNotesState.get('viewOptions').get(caseNotesState.get('viewId'))
);

const selectCaseNotesDetailId = () => createSelector(
  selectCaseNotes(),
  (caseNotesState) => caseNotesState.get('caseNoteDetailId')
);

const selectDisplayAddCaseNoteModal = () => createSelector(
  selectDetails(),
  (detailsState) => detailsState.get('addCaseNoteModal')
);

const selectScheduledEvents = () => createSelector(
  selectDetails(),
  (detailsState) => (detailsState.get('scheduledEvents') && detailsState.get('scheduledEvents').toJS()) || null,
);

const selectCurrentFilter = () => createSelector(
  selectDetails(),
  (detailsState) => detailsState.get('currentFilter'),
);

const selectAppointmentViewModel = () => createSelector(
  selectSearch(),
  (search) => search.get('appointmentViewModel') && search.get('appointmentViewModel').toJS(),
);

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
  selectCurrentDetailTabId,
  selectOffenderDetails,
  selectOffenderDetailsMobile,
  selectPhysicalAttributes,
  selectPhysicalMarks,
  selectHeaderDetail,
  selectAlertsPagination,
  selectBookingDetailsId,
  selectCaseNotesPagination,
  selectCaseNotesQuery,
  selectCaseNotesView,
  selectCaseNotesDetailId,
  selectDisplayAddCaseNoteModal,
  selectDisplayAmendCaseNoteModal,
  selectShouldShowLargePhoto,
  selectImageId,
  selectLocations,
  intlSelector,
  selectKeyDatesViewModel,
  selectError,
  selectQuickLookViewModel,
  selectScheduledEvents,
  selectCurrentFilter,
  selectAppointmentViewModel,
  selectName,
};
