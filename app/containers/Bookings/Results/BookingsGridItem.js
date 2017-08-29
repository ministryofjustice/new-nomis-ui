import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import { toFullName } from 'utils/stringUtils';

import {
  GridDetailItem,
  GridDetailImage,
  GridDetailInfo,
  GridName,
  GridID,
  GridLocation
} from './results.theme';

const BookingsGridItem = (props) => {
  const { data, action } = props;
  const { firstName, lastName, facialImageId, bookingNo, offenderNo, assignedLivingUnitDesc } = data;
  return (
    <GridDetailItem onClick={() => action(data.bookingId)}>
      <GridDetailImage><EliteImage imageId={facialImageId} /></GridDetailImage>
      <GridDetailInfo>
        <GridName>{toFullName({firstName, lastName})}</GridName>
        <GridID>ID: <strong>{offenderNo}</strong></GridID>
        <GridLocation><div>{assignedLivingUnitDesc}</div></GridLocation>
      </GridDetailInfo>
    </GridDetailItem>
  );
};

BookingsGridItem.propTypes = {
  data: PropTypes.object.isRequired,
  action: PropTypes.func.isRequired,
};

BookingsGridItem.defaultProps = {
};

export default BookingsGridItem;
