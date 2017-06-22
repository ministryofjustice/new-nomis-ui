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

import { selectPhysicalAttributes, selectPhysicalMarks, selectHeaderDetail } from '../../selectors';

class PhysicalAttributes extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { physicalAttributes, physicalMarks, headerDetails } = this.props;
    const CharacteristicsTable = {
      title: 'Characteristics',
      columnWidths: [3, 4],
      rows: physicalAttributes.characteristicGrid,
    };

    const marksArray = physicalMarks.map((mark, index) =>
      (<DataGrid
        key={`Mark ${index + 1}`}
        gridData={{
          title: `Mark ${index + 1}`,
          columnWidths: [3, 4],
          rows: mark,
        }}
        headerDetails={headerDetails}
      />)
    );

    return (<div>
      <DataGrid
        gridData={CharacteristicsTable}
        setModalOpen={this.props.setModalOpen}
        setModalData={this.props.setModalData}
        headerDetails={headerDetails}
      />
      {marksArray}
      {/* <DataGrid gridData={AliasTable} /> */}
    </div>);
  }
}

PhysicalAttributes.propTypes = {
  physicalAttributes: PropTypes.object.isRequired,
  physicalMarks: PropTypes.array.isRequired,
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
  physicalMarks: selectPhysicalMarks(),
  headerDetails: selectHeaderDetail(),
  // activeTabId: selectCurrentDetailTabId(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(PhysicalAttributes);
