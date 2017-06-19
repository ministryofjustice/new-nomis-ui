
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import { loadBookingDetails } from 'containers/EliteApiLoader/actions';
import DataGrid from 'components/Bookings/Details/dataGridViewComponent';
//
// import {
// } from './physicalAttributes.theme';

// import { search } from './actions';
import { setModalOpen, setModalData } from 'globalReducers/app';

import { selectPhysicalAttributes, selectHeaderDetail } from '../../selectors';

class PhysicalAttributes extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { physicalAttributes, headerDetails } = this.props;
    const CharacteristicsTable = {
      title: 'Characteristics',
      columnWidths: [3, 4],
      rows: physicalAttributes.characteristicGrid,
    };

    return (<div>
      <DataGrid
        gridData={CharacteristicsTable}
        setModalOpen={this.props.setModalOpen}
        setModalData={this.props.setModalData}
        headerDetails={headerDetails}
      />
      {/* <DataGrid gridData={AliasTable} /> */}
    </div>);
  }
}

PhysicalAttributes.propTypes = {
  physicalAttributes: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
  headerDetails: PropTypes.object.isRequired,
};

// const mapDispatchToProps = {
//   setModalOpen,
//   setModalData,
// };

export function mapDispatchToProps(dispatch) {
  return {
    setModalOpen: (bool) => dispatch(setModalOpen(bool)),
    setModalData: (bool) => dispatch(setModalData(bool)),
  };
}

const mapStateToProps = createStructuredSelector({
  physicalAttributes: selectPhysicalAttributes(),
  headerDetails: selectHeaderDetail(),
  // activeTabId: selectCurrentDetailTabId(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(PhysicalAttributes);
