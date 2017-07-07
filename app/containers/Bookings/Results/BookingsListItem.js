import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import { ListDetailItem, ListDetailImage, Name, ID } from './results.theme';

const BookingsListItem = (props) => {
  const { data, action } = props;
  const { firstName, lastName, facialImageId, bookingNo, offenderNo, assignedLivingUnitDesc } = data;
  return (
    <ListDetailItem onClick={() => action(data.bookingId)}>
      <ListDetailImage><EliteImage imageId={facialImageId} /></ListDetailImage>
      <Name>{lastName}, {firstName[0].toUpperCase() + firstName.toLowerCase().slice(1)}</Name>
      <ID>ID: <strong>{offenderNo}</strong></ID>
      <div>{assignedLivingUnitDesc}</div>
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
