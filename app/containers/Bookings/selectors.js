
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
  (query, pagination, sortOrder, eliteApi) => {

    let result = calcBookingResults(eliteApi, {query, pagination, sortOrder});

    return result.map(data => {

      return {
        ...data,
        firstName: CapitaliseFirstLetter(data.firstName),
        lastName: CapitaliseFirstLetter(data.lastName),
        aliases: data.aliases
          .map(a => a.split(' '))
          .map(parts => parts.map(name => CapitaliseFirstLetter(name)))
          .map(parts => parts.join(' '))
      }
    });
  }
);

const CapitaliseFirstLetter = (string) =>  {
  if((typeof string) === 'string' &&  string.length >= 1)
    return string[0].toUpperCase() + string.toLowerCase().slice(1);
  else
    return string;
}


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
    // assessments
    const assessments = bookingDetails.getIn(['Data', 'assessments']).map((ass) => {
      const value = ass.get('classification');
      const code = ass.get('assessmentCode');
      const title = ass.get('assessmentDesc');
      return { key: [value, code, title].join('-'), title, value };
    });

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
    ].concat(assessments && assessments.toJS ? assessments.toJS() : []);

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
      title: 'Gender',
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
    const modalGridArray = [];
    let imageIndex = 0;

    const characteristicGrid = pcs.map((char, index) => {
      const { characteristic: title, imageId, detail: value } = char;

      if (imageId) {
        const modalGridObject = { array: [], index: imageIndex };
        modalGridObject.array = [{ title, value, key: `${value}${index}` },
          { title: '', imageId, imageIndex, key: `${imageId}${index}` },
        ];
        modalGridObject.imageId = imageId;
        imageIndex += 1;
        modalGridArray.push(modalGridObject);
      }

      return {
        key: `${char.characteristic}${index}`,
        title,
        value,
        imageId,
        imageIndex: imageIndex - 1,
      };
    });

    return { characteristicGrid, modalGridArray };
  });

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
};
