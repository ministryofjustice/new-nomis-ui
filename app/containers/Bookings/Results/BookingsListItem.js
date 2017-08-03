import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import { ListDetailItem, ListDetailImage, Name, ID, GroupedDetails } from './results.theme';

const BookingsListItem = (props) => {
  const { data, action } = props;
  const { firstName, lastName, facialImageId, bookingNo, offenderNo, assignedLivingUnitDesc } = data;
  return (
    <ListDetailItem onClick={() => action(data.bookingId)}>

      <ListDetailImage><EliteImage imageId={facialImageId} /></ListDetailImage>
      <div className="personAttributes">
        <Name>{lastName}, {firstName[0].toUpperCase() + firstName.toLowerCase().slice(1)}</Name>
        <ID>{offenderNo}</ID>
        <div>{assignedLivingUnitDesc}</div>
      </div>

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
