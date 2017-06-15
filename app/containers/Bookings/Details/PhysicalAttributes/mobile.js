import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import { loadBookingDetails } from 'containers/EliteApiLoader/actions';
import DataGrid from 'components/Bookings/Details/dataGridViewComponentMobile';
//
// import {
// } from './physicalAttributes.theme';

// import { search } from './actions';
import { selectPhysicalAttributes } from '../../selectors';

class PhysicalAttributes extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { physicalAttributes } = this.props;
    const CharacteristicsTable = {
      title: 'Characteristics',
      columnWidths: [5, 8],
      rows: physicalAttributes.characteristicGrid,
    };
    // const AliasTable = {
    //   title: 'Aliases',
    //   columnWidths: [3, 4, 1, 1, 2, 2],
    //   rows: physicalAttributes.aliasGrid,
    // };
    return (<div>
      <DataGrid gridData={CharacteristicsTable} />
      {/* <DataGrid gridData={AliasTable} /> */}
    </div>);
  }
}

PhysicalAttributes.propTypes = {
  physicalAttributes: PropTypes.object.isRequired,
};

export function mapDispatchToProps() {
  return {
    // loadBookingDetails: (id) => dispatch(loadBookingDetails(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  physicalAttributes: selectPhysicalAttributes(),
  // activeTabId: selectCurrentDetailTabId(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(PhysicalAttributes);
