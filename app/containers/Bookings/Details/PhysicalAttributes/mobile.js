import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import DataGrid from 'components/Bookings/Details/dataGridViewComponentMobile';

import { setModalOpen, setModalData } from 'globalReducers/app';

import { selectPhysicalAttributes, selectPhysicalMarks } from '../../selectors';

import { showLargePhoto } from '../../actions';

class PhysicalAttributes extends PureComponent {
  render() {
    const { physicalAttributes, physicalMarks, setModalOpen, showVisualMarkingsPhoto } = this.props;
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
        setModalOpen={setModalOpen}
        setModalData={setModalData}
        onImageClick={showVisualMarkingsPhoto}
      />)
    );

    return (<div>
      <DataGrid
        gridData={CharacteristicsTable}
        modalGridArray={physicalAttributes.modalGridArray}
        setModalOpen={setModalOpen}
        setModalData={setModalData}
        onImageClick={showVisualMarkingsPhoto}
      />
      {marksArray}
    </div>);
  }
}

PhysicalAttributes.propTypes = {
  physicalAttributes: PropTypes.object.isRequired,
  physicalMarks: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    setModalOpen: (bool) => dispatch(setModalOpen(bool)),
    setModalData: (bool) => dispatch(setModalData(bool)),
    showVisualMarkingsPhoto: (imageId) => dispatch(showLargePhoto(imageId)),
  };
}

const mapStateToProps = createStructuredSelector({
  physicalAttributes: selectPhysicalAttributes(),
  physicalMarks: selectPhysicalMarks(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(PhysicalAttributes);
