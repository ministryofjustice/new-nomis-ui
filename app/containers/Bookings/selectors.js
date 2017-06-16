
import { createSelector } from 'reselect';
import { selectEliteApi, calcBookingResults, calcBookingResultsTotalRecords, selectBookingDetails as selectEliteBookingDetails } from 'containers/EliteApiLoader/selectors';
import nameString from 'components/NameStrings';

const selectSearch = () => (state) => state.get('search');

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
  selectSearchQuery(),
  selectSearchResultsPagination(),
  selectSearchResultsSortOrder(),
  selectEliteApi(),
  (query, pagination, sortOrder, eliteApi) => calcBookingResults(eliteApi, { query, pagination, sortOrder })
);

const selectSearchResultsTotalRecords = () => createSelector(
  selectSearchQuery(),
  selectEliteApi(),
  (query, eliteApi) => calcBookingResultsTotalRecords(eliteApi, { query })
);

const selectDetails = () => createSelector(
  selectSearch(),
  (searchState) => searchState.get('details')
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
  (bookingDetails) => {
    // Mash data into what is needed for the DataGridViewComponent.
    // date of birth
    const dateOfBirth = bookingDetails.getIn(['Data', 'dateOfBirth']);
    // age
    const age = bookingDetails.getIn(['Data', 'age']);
    // gender
    const gender = bookingDetails.getIn(['Data', 'physicalAttributes', 'gender']);
    // categorisation
    // csra

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
      title: 'gender',
      value: gender,
    },
    ];

    const aliases = bookingDetails.getIn(['Data', 'aliases']).toJS();

    const aliasGrid = aliases.map((alias, index) => {
      const { firstName, lastName, age: aliasAge, ethinicity: ethnicity, nameType, dob: aliasDateofbirth, gender: aliasGender } = alias;
      const name = nameString({ firstName, lastName, format: 'TITLE_TITLE' });
      return { key: `${firstName + lastName + aliasAge + ethnicity + nameType + index}`, title: nameType, values: [{ name }, { aliasAge }, { aliasGender }, { aliasDateofbirth }, { ethnicity }] };
    });
    //  { dateOfBirth, age, gender };

    return {
      personalGrid,
      aliasGrid,
    };
  }
);

const selectOffenderDetailsMobile = () => createSelector(
  selectBookingDetail(),
  (bookingDetails) => {
    // Mash data into what is needed for the DataGridViewComponent.
    // date of birth
    const dateOfBirth = bookingDetails.getIn(['Data', 'dateOfBirth']);
    // age
    const age = bookingDetails.getIn(['Data', 'age']);
    // gender
    const gender = bookingDetails.getIn(['Data', 'physicalAttributes', 'gender']);
    // categorisation
    // csra

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
      title: 'gender',
      value: gender,
    },
    ];

    const aliases = bookingDetails.getIn(['Data', 'aliases']).toJS();

    const aliasGrid = aliases.map((alias, index) => {
      const { firstName, lastName, age: aliasAge, ethinicity: ethnicity, nameType } = alias; // , dob: aliasDateofbirth, gender: aliasGender
      const name = nameString({ firstName, lastName, format: 'TITLE_TITLE' });
      return { key: `${firstName + lastName + aliasAge + ethnicity + nameType + index}`, title: nameType, values: [{ name }] };
    });
    //  { dateOfBirth, age, gender };

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
    const characteristicGrid = pcs.map((char, index) => {
      const { characteristic: title, imageId, detail: value } = char;
      return {
        key: `${char.characteristic}${index}`,
        title,
        value,
        imageId,
      };
    });

    return { characteristicGrid };
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
  selectHeaderDetail,
  selectAlertsPagination,
  selectBookingDetailsId,
  selectCaseNotesPagination,
  selectCaseNotesQuery,
  selectCaseNotesView,
  selectCaseNotesDetailId,
  selectDisplayAddCaseNoteModal,
  selectDisplayAmendCaseNoteModal,
};
