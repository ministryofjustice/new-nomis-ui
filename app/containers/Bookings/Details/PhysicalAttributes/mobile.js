import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import DataGrid from 'components/Bookings/Details/dataGridViewComponentMobile';

import { setModalOpen, setModalData } from 'globalReducers/app';

import { selectPhysicalAttributes, selectPhysicalMarks } from '../../selectors';

import {showLargePhoto} from '../../actions'

class PhysicalAttributes extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { physicalAttributes, physicalMarks } = this.props;
    const CharacteristicsTable = {
      title: 'Characteristics',
      columnWidths: [5, 8],
      rows: physicalAttributes.characteristicGrid,
    };

    const marksArray = physicalMarks.marksGridArray.map((mark, index) =>
      (<DataGrid
        key={`Mark ${index + 1}`}
        gridData={{
          title: `Mark ${index + 1}`,
          columnWidths: [5, 8],
          rows: mark,
        }}
        modalGridArray={physicalMarks.modalGridArray}
        setModalOpen={this.props.setModalOpen}
        setModalData={this.props.setModalData}
        onImageClick={this.props.showVisualMarkingsPhoto}
      />)
    );

    return (<div>
      <DataGrid
        gridData={CharacteristicsTable}
        modalGridArray={physicalAttributes.modalGridArray}
        setModalOpen={this.props.setModalOpen}
        setModalData={this.props.setModalData}
        onImageClick={this.props.showVisualMarkingsPhoto}
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
    showVisualMarkingsPhoto: (imageId) => dispatch(showLargePhoto(imageId))
  };
}

const mapStateToProps = createStructuredSelector({
  physicalAttributes: selectPhysicalAttributes(),
  physicalMarks: selectPhysicalMarks(),
  // activeTabId: selectCurrentDetailTabId(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(PhysicalAttributes);
