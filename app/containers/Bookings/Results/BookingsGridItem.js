import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';
import EliteLocation from 'containers/EliteContainers/Location';
import { GridDetailItem, GridDetailImage, GridDetailInfo, GridName, GridID } from './results.theme';

// agencyId: 'ITAG',
// lastName: 'DONALDSON',
// facialImageId: 8572,
// alertsCodes: [],
// bookingId: 18800,
// livingUnitId: 5345,
// offenderNo: '0001019082',
// bookingNo: '2013-18856',
// firstName: 'ROBERT',

const BookingsGridItem = (props) => {
  const { data, action } = props;
  const { firstName, lastName, facialImageId, bookingNo, offenderNo, livingUnitId } = data;
  return (
    <GridDetailItem onClick={() => action(data.bookingId)}>
      <GridDetailImage>{facialImageId ? <EliteImage imageId={facialImageId} /> : null}</GridDetailImage>
      <GridDetailInfo>
        <GridName>{lastName}, {firstName[0].toUpperCase() + firstName.toLowerCase().slice(1)}</GridName>
        <GridID>ID: <strong>{offenderNo}</strong></GridID>
        <GridID><EliteLocation locationId={livingUnitId} /></GridID>
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
