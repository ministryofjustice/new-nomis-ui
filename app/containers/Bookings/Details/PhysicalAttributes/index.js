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

import { selectPhysicalAttributes, selectPhysicalMarks } from '../../selectors';

class PhysicalAttributes extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { physicalAttributes, physicalMarks } = this.props;
    const CharacteristicsTable = {
      title: 'Characteristics',
      columnWidths: [3, 4],
      rows: physicalAttributes.characteristicGrid,
    };

    const marksArray = physicalMarks.marksGridArray.map((mark, index) =>
      (<DataGrid
        key={`Mark ${index + 1}`}
        gridData={{
          title: `Mark ${index + 1}`,
          columnWidths: [3, 4],
          rows: mark,
        }}
        modalGridArray={physicalMarks.modalGridArray}
        setModalOpen={this.props.setModalOpen}
        setModalData={this.props.setModalData}
      />)
    );

    return (<div>
      <DataGrid
        gridData={CharacteristicsTable}
        modalGridArray={physicalAttributes.modalGridArray}
        setModalOpen={this.props.setModalOpen}
        setModalData={this.props.setModalData}
      />
      {marksArray}
      {/* <DataGrid gridData={AliasTable} /> */}
    </div>);
  }
}

PhysicalAttributes.propTypes = {
  physicalAttributes: PropTypes.object.isRequired,
  physicalMarks: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
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
  // activeTabId: selectCurrentDetailTabId(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(PhysicalAttributes);
