import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import { toFullName } from 'utils/stringUtils';

import {
  ListDetailItem,
  ListDetailImage,
  Name,
  ID,
} from './results.theme';

const BookingsListItem = (props) => {
  const { data, action } = props;
  const { firstName, lastName, facialImageId, offenderNo, assignedLivingUnitDesc } = data;
  return (
    <ListDetailItem onClick={() => action(data.bookingId)}>

      <ListDetailImage><EliteImage imageId={facialImageId} /></ListDetailImage>
      <div className="personAttributes">
        <Name>{toFullName({ firstName, lastName })}</Name>
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
