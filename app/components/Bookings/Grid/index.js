import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import uuid from 'uuid/v4';

import EliteImage from 'containers/EliteContainers/Image';
import { offenderImageUrl } from 'containers/Bookings/constants';

import Name from 'components/Name';

import './index.scss';

const Grid = ({ results, viewDetails, sortOrderChange, sortOrder }) => (
  <div className="booking-grid">
    {sortOrderChange &&
      <div className="no-left-gutter sort-by-select visible-md visible-lg">
        <span className="col-xs-1">Sort by:</span>
        <select
          className="form-control" value={sortOrder} onChange={(e) => {
            sortOrderChange(e.target.value);
          }}
        >
          <option value="ASC">Names A to Z </option>
          <option value="DESC">Names Z to A </option>
        </select>
      </div>
    }

    {sortOrderChange && <div className="separator" />}

    <div className="grid">
      {(results).map((row) => (
        <div className="grid-item" key={uuid()}>

          <div className="person-block">

            <div className="grid-photo" onClick={() => viewDetails(row.get('offenderNo'))}>
              <EliteImage src={offenderImageUrl(row.get('facialImageId'))} />
            </div>

            <div className="person-details">

              <div className="person-name bold">
                <Name lastName={row.get('lastName')} firstName={row.get('firstName')} />
              </div>

              <div className="ancillary-text">
                {row.get('offenderNo')}
              </div>

              <div className="ancillary-text">
                {row.get('assignedLivingUnitDesc')}
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

Grid.defaultProps = {
  sortOrderChange: () => {},
}

Grid.propTypes = {
  results: ImmutablePropTypes.list.isRequired,
  viewDetails: PropTypes.func.isRequired,
  sortOrderChange: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,

};

export default Grid;
