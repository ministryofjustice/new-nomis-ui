import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import { browserHistory } from 'react-router';

import EliteImage from 'containers/EliteContainers/Image';
import { offenderImageUrl } from 'containers/Bookings/constants';

import Name from 'components/Name';
import { DETAILS_TABS } from 'containers/Bookings/constants';

import './index.scss';
import AlertFlags from '../AlertFlags';

const ArrowUp = ({ sortOrderChange }) => <span className="clickable" onClick={sortOrderChange}> <img src="/img/Triangle_asc.png" height="8" width="15" /> </span>;
const ArrowDown = ({ sortOrderChange }) => <span className="clickable" onClick={sortOrderChange}> <img src="/img/Triangle_desc.png" height="8" width="15" /> </span>;

const onViewDetails = (event, row) => {
  event.preventDefault();

  browserHistory.push(`/offenders/${row.get('offenderNo')}/${DETAILS_TABS.QUICK_LOOK}`)
};

const Table = ({ results, sortOrder, sortOrderChange, onAlertFlagClick }) => (
  <div className="booking-table">
    <div className="row">

      <div className="col-xs-3 col-md-1 remove-left-padding">
      </div>

      <div className="col-xs-3 col-md-3">
        <b> Name </b> {sortOrderChange &&
      (sortOrder === 'ASC' ? <ArrowUp sortOrderChange={sortOrderChange} /> : <ArrowDown sortOrderChange={sortOrderChange} />)}
      </div>

      <div className="col-xs-3 col-md-1 no-left-gutter no-right-gutter">
        <b className="visible-md-inline-block visible-lg-inline-block no-left-gutter"> Prison</b> <b>No. </b>
      </div>

      <div className="col-xs-3 col-md-1 no-left-gutter">
        <b> Location </b>
      </div>

      <div className="visible-md visible-lg col-md-1 no-left-gutter no-right-gutter">
        <b> IEP </b>
      </div>

      <div className="visible-md visible-lg col-md-1">
        <b> Age </b>
      </div>

      <div className="visible-md visible-lg col-md-3 no-left-gutter no-right-gutter">
        <b> Flags </b>
      </div>
    </div>

      {(results).map((row) =>
        <div className="row" key={`booking_table_${row.get('offenderNo')}`}>
          <div className="col-xs-3 col-md-1 remove-left-padding">
            <div className="photo clickable" onClick={(e) => onViewDetails(e, row)}>
              <EliteImage src={offenderImageUrl(row.get('facialImageId'))} />
            </div>
          </div>
          <div className="col-xs-3 col-md-3 add-margin-top">
            <span>
              <div role="link" className="bold link" onClick={(e) => onViewDetails(e, row)}>
                <Name lastName={row.get('lastName')} firstName={row.get('firstName')} />
              </div>
            </span>
          </div>
          <div className="col-xs-3 col-md-1 add-margin-top no-left-gutter no-right-gutter">
            <span>{row.get('offenderNo')}</span>
          </div>
          <div className="col-xs-3 col-md-1 add-margin-top no-left-gutter">
            <span>{row.get('assignedLivingUnitDesc')}</span>
          </div>
          <div className="visible-md visible-lg col-md-1 add-margin-top no-left-gutter no-right-gutter">
            <span>{row.get('iepLevel')}</span>
          </div>
          <div className="visible-md visible-lg col-md-1 add-margin-top">
            <span>{row.get('age')}</span>
          </div>
          <div className="visible-md visible-lg col-md-3 add-flags-margin-top no-left-gutter no-right-gutter">
            {AlertFlags(row.get('alertsDetails'), 'inline-header-large align-alerts', () => onAlertFlagClick(row.get('offenderNo')))}
          </div>
        </div>
    )}
    </div>
);

Table.defaultProps = {
  sortOrderChange: () => {},
}

Table.propTypes = {
  results: ImmutablePropTypes.list.isRequired,
  sortOrderChange: PropTypes.func,
  sortOrder: PropTypes.string.isRequired,
};

export default Table;
