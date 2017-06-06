
import { createSelector } from 'reselect';
import { queryHash, paginationHash, idsFromPagination } from './helpers';

const selectEliteApi = () => (state) => state.get('eliteApiLoader');

const calcBookingResultStatus = (eliteApiState, { query, pagination, sortOrder }) => {
  const searchQueryStatus = eliteApiState.getIn([
    'Bookings',
    'Search',
    queryHash(query),
    'Sorted', sortOrder,
    'Paginations',
    paginationHash(pagination),
    'Status',
  ]);
  if (!searchQueryStatus) {
    return { Type: 'NOT LOADED' };
  }
  return searchQueryStatus.toJS();
};

const selectBookingResultStatus = ({ query, pagination, sortOrder }) => createSelector(
  selectEliteApi(),
  (eliteApiState) => calcBookingResultStatus(eliteApiState, { query, pagination, sortOrder })
);

const calcBookingResults = (eliteApiState, { query, pagination, sortOrder }) => {
  const status = calcBookingResultStatus(eliteApiState, { query, pagination, sortOrder });

  if (status.Type !== 'SUCCESS') {
    return [];
  }

  const searchQueryIds = eliteApiState.getIn(['Bookings', 'Search', queryHash(query), 'Sorted', sortOrder, 'SortedIds']).toJS();

  // Get the sortedIds for the full page of search results
  const ids = idsFromPagination(pagination).map((sortId) => searchQueryIds[sortId]).filter((n) => n);
  const bookingSummaries = eliteApiState.getIn(['Bookings', 'Summaries']).toJS();
  return ids.map((id) => bookingSummaries[id]);
};

const calcBookingResultsTotalRecords = (eliteApiState, { query }) => eliteApiState.getIn(['Bookings', 'Search', queryHash(query), 'MetaData', 'TotalRecords']);

const selectBookingResults = ({ query, pagination, sortOrder }) => createSelector(
  selectEliteApi(),
  (eliteApi) => calcBookingResults(eliteApi, { query, pagination, sortOrder })
);

const selectImages = () => createSelector(
  selectEliteApi(),
  (eliteApi) => eliteApi.get('Images')
);

const selectImageId = () => (_, props) => props.imageId;

const selectImage = () => createSelector(
  selectImages(),
  selectImageId(),
  (images, id) => images.get(id)
);

const selectImageStatus = () => createSelector(
  selectImage(),
  (image) => { if (image) return image.get('Status').toJS(); return { Type: 'NOT STARTED' }; }
);

const selectBookingDetails = () => createSelector(
  selectEliteApi(),
  (eliteApi) => eliteApi.getIn(['Bookings', 'Details'])
);

export {
  selectEliteApi,
  selectBookingResultStatus,
  selectBookingResults,
  calcBookingResultStatus,
  calcBookingResults,
  calcBookingResultsTotalRecords,
  selectImage,
  selectImageStatus,
  selectBookingDetails,
};
