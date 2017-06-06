
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import { loadBookingDetails } from 'containers/EliteApiLoader/actions';
import DataGrid from 'components/Bookings/Details/dataGridViewComponent';

import {
} from './offenderDetails.theme';

// import { search } from './actions';
import { selectOffenderDetails } from '../../selectors';

class OffenderDetails extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { offenderDetails } = this.props;
    const PersonalTable = {
      title: 'Personal',
      columnWidths: [3, 4],
      rows: offenderDetails.personalGrid,
    };
    const AliasTable = {
      title: 'Aliases',
      columnWidths: [3, 4, 1, 1, 2, 2],
      rows: offenderDetails.aliasGrid,
    };
    return (<div>
      <DataGrid gridData={PersonalTable} />
      <DataGrid gridData={AliasTable} />
    </div>);
  }
}

OffenderDetails.propTypes = {
  offenderDetails: PropTypes.array.isRequired,
};

export function mapDispatchToProps() {
  return {
    // loadBookingDetails: (id) => dispatch(loadBookingDetails(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  offenderDetails: selectOffenderDetails(),
  // activeTabId: selectCurrentDetailTabId(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(OffenderDetails);
