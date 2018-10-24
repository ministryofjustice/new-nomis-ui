import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import DataGrid from 'components/Bookings/Details/dataGridViewComponent'

import { setModalOpen, setModalData } from 'globalReducers/app'

import { selectPhysicalAttributes, selectPhysicalMarks } from '../../selectors'

class PhysicalAttributes extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { physicalAttributes, physicalMarks, setModalOpen, setModalData } = this.props
    const CharacteristicsTable = {
      title: 'Characteristics',
      columnWidths: [3, 4],
      rows: physicalAttributes.characteristicGrid,
    }

    const marksArray = physicalMarks.marksGridArray.map((mark, index) => (
      <DataGrid
        key={`Mark ${index + 1}`}
        gridData={{
          title: `Mark ${index + 1}`,
          columnWidths: [3, 4],
          rows: mark,
        }}
        modalGridArray={physicalMarks.modalGridArray}
        setModalOpen={setModalOpen}
        setModalData={setModalData}
      />
    ))

    return (
      <div>
        <DataGrid
          gridData={CharacteristicsTable}
          modalGridArray={physicalAttributes.modalGridArray}
          setModalOpen={setModalOpen}
          setModalData={setModalData}
        />
        {marksArray}
      </div>
    )
  }
}

PhysicalAttributes.propTypes = {
  physicalAttributes: PropTypes.object.isRequired,
  physicalMarks: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
}

export function mapDispatchToProps(dispatch) {
  return {
    setModalOpen: bool => dispatch(setModalOpen(bool)),
    setModalData: bool => dispatch(setModalData(bool)),
  }
}

const mapStateToProps = createStructuredSelector({
  physicalAttributes: selectPhysicalAttributes(),
  physicalMarks: selectPhysicalMarks(),
})

// Wrap the component to inject dispatch and state into it
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhysicalAttributes)
