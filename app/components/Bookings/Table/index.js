import PropTypes from 'prop-types';
import React from 'react';

import EliteImage from 'containers/EliteContainers/Image';
import Name from 'components/Name';
import './index.scss';

const ArrowUp = ({ sortOrderChange }) => <span className="clickable" onClick={sortOrderChange}> &#9650; </span>;
const ArrowDown = ({ sortOrderChange }) => <span className="clickable" onClick={sortOrderChange}> &#9660; </span>;

const onViewDetails = (e, row, viewDetails) => {
  e.preventDefault(e);
  viewDetails(row.bookingId);
};

const Table = ({ results, viewDetails, sortOrder, sortOrderChange }) => (
  <div className="booking-table">
    <div className="row">

      <div className="col-xs-3 col-md-2">
      </div>

      <div className="col-xs-4 col-md-3">
        <b> Name </b> {sortOrderChange &&
      (sortOrder === 'ASC' ? <ArrowUp sortOrderChange={sortOrderChange} /> : <ArrowDown sortOrderChange={sortOrderChange} />)}
      </div>

      <div className="col-xs-2 col-md-2">
        <b> ID </b>
      </div>

      <div className="visible-md visible-lg col-md-2">
        <b> IEP </b>
      </div>

      <div className="visible-md visible-lg col-md-1">
        <b> Age </b>
      </div>

      <div className="col-xs-3 col-md-2">
        <b> Location </b>
      </div>
    </div>

      {(results || []).map((row) =>
        <div className="row" key={row.bookingId}>
          <div className="col-xs-3 col-md-2 remove-left-padding">
            <div className="photo clickable" onClick={(e) => onViewDetails(e, row, viewDetails)}>
              <EliteImage imageId={row.facialImageId} />
            </div>
          </div>
          <div className="col-xs-4 col-md-3 add-margin-top">
            <span>
              <div role="link" className="bold link" onClick={(e) => onViewDetails(e, row, viewDetails)}>
                <Name lastName={row.lastName} firstName={row.firstName} />
              </div>
            </span>
          </div>
          <div className="col-xs-2 col-md-2 add-margin-top">
            <span>{row.offenderNo}</span>
          </div>
          <div className="visible-md visible-lg col-md-2 add-margin-top">
            <span>{row.iepLevel}</span>
          </div>
          <div className="visible-md visible-lg col-md-1 add-margin-top">
            <span>{row.age}</span>
          </div>
          <div className="col-xs-3 col-md-2 add-margin-top">
            <span>{row.assignedLivingUnitDesc}</span>
          </div>
        </div>
    )}
    </div>
);

Table.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetails: PropTypes.func.isRequired,
  sortOrderChange: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,

};

export default Table;
