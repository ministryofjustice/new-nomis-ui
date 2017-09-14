import PropTypes from 'prop-types';
import React from 'react';
import { FormattedDate } from 'react-intl';

import EliteImage from 'containers/EliteContainers/Image';
import Name from 'components/Name';

import './index.scss';

const Grid = ({ results, viewDetails, sortOrderChange, sortOrder }) => (
  <div className="booking-grid">
    {sortOrderChange !== undefined ?
      <div className="row sort-by-select visible-md visible-lg">
        <span className="col-xs-1">Sort by:</span>
        <select
          className="form-control" value={sortOrder} onChange={(e) => {
            sortOrderChange(e.target.value);
          }}
        >
          <option value="asc">Names A to Z</option>
          <option value="desc">Names Z to A</option>
        </select>
      </div>
      :
      null
    }
    {sortOrderChange !== undefined ? <div className="separator" /> : null}

    <div className="grid">
      {results.map((row) => (
        <div className="grid-item" key={row.bookingId}>

          <div className="person-block">

            <div className="grid-photo" onClick={() => viewDetails(row.bookingId)}>
              <EliteImage imageId={row.facialImageId} />
            </div>

            <div className="person-details">
              <div className="person-name bold">
                <Name lastName={row.lastName} firstName={row.firstName} />
              </div>

              <div>
                {row.offenderNo}
              </div>

              <div>
                <FormattedDate value={Date.parse(row.dateOfBirth)} />
              </div>

              <div>
                {row.assignedLivingUnitDesc}
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  </div>
);

Grid.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetails: PropTypes.func.isRequired,
  sortOrderChange: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,

};

export default Grid;
