import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import EliteLocation from 'containers/EliteContainers/Location';
import { ListDetailItem, ListDetailImage, Name, ID } from './results.theme';

// agencyId: 'ITAG',
// lastName: 'DONALDSON',
// facialImageId: 8572,
// alertsCodes: [],
// bookingId: 18800,
// livingUnitId: 5345,
// offenderNo: '0001019082',
// bookingNo: '2013-18856',
// firstName: 'ROBERT',

const BookingsListItem = (props) => {
  const { data, action } = props;
  const { firstName, lastName, facialImageId, bookingNo, assignedLivingUnitId } = data;
  return (
    <ListDetailItem onClick={() => action(data.bookingId)}>
      <ListDetailImage>{facialImageId ? <EliteImage imageId={facialImageId} /> : null}</ListDetailImage>
      <Name>{lastName}, {firstName[0].toUpperCase() + firstName.toLowerCase().slice(1)}</Name>
      <ID>ID: <strong>{bookingNo}</strong></ID>
      <EliteLocation locationId={assignedLivingUnitId} />
    </ListDetailItem>
  );
};

BookingsListItem.propTypes = {
  data: PropTypes.object.isRequired,
  action: PropTypes.func.isRequired,
};

BookingsListItem.defaultProps = {
};

export default BookingsListItem;
