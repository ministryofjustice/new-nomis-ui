import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import DataGrid from 'components/Bookings/Details/dataGridViewComponentMobile';
import { selectOffenderDetailsMobile } from '../../selectors';
import PhysicalAttributesMobile from './../PhysicalAttributes/mobile';

class OffenderDetails extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { offenderDetails } = this.props;
    const PersonalTable = {
      title: 'Personal',
      columnWidths: [5, 8],
      rows: offenderDetails.personalGrid,
    };
    const AliasTable = {
      title: 'Aliases',
      columnWidths: [5, 8],
      rows: offenderDetails.aliasGrid,
    };
    return (<div>
      <DataGrid gridData={PersonalTable} />
      <DataGrid gridData={AliasTable} />
      <PhysicalAttributesMobile {...this.props} />
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
  offenderDetails: selectOffenderDetailsMobile(),
  // activeTabId: selectCurrentDetailTabId(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(OffenderDetails);
