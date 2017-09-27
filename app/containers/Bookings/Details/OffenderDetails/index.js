import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import DataGrid from 'components/Bookings/Details/dataGridViewComponent';
import { selectOffenderDetails } from '../../selectors';

import PhysicalAttributes from '../PhysicalAttributes';

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
      <PhysicalAttributes {...this.props} />
    </div>);
  }
}

OffenderDetails.propTypes = {
  offenderDetails: PropTypes.object.isRequired,
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
