

import React from 'react';
import PropTypes from 'prop-types';
import EliteImage from 'containers/EliteContainers/Image';

import {
  DataGridWrapper,
  DGTitle,
  DGRow as DgRowStyle,
  DGRowTitle,
  DGRowItem,
  DGImageItem,
  DGImageCaption,
} from './dataGridViewComponentMobile.theme';

function DgRow({ title, value: v, values, imageId, columnWidths, setModalOpen, setModalData, headerDetails }) {
  const showModal = function () {
    const toTitleCase = (str) => str[0].toUpperCase() + str.slice(1).toLowerCase();

    const { firstName, lastName, bookingNo } = headerDetails;

    const nameString = `${lastName.toUpperCase()}, ${toTitleCase(firstName)}`;
    // Officer Loader...
    const officer = { firstName: 'PAYNE', lastName: 'RON' };
    const officerNameString = `${toTitleCase(officer.lastName)}, ${toTitleCase(officer.firstName)}`;

    const modalData = {
      type: 'photo',
      photos: this,
      name: nameString,
      id: bookingNo,
      keyWorker: officerNameString,
    };

    setModalOpen(true);
    setModalData(modalData);
  };

  let rowVals = null;
  let value = v;
  if (!value && !values && !imageId) value = '—';
  if (value && !imageId) {
    rowVals = <DGRowItem colWidth={columnWidths[1]}>{value}</DGRowItem>;
  } else if (values) {
    rowVals = values.map((obj, index) => {
      // This garbage is to produce proper keys to let react sleep more easily.
      // values looks like [{name: 'Al Grant'}, {height: '191cm'}]
      const key = Object.keys(obj)[0];
      const val = obj[key];
      return <DGRowItem key={key} colWidth={columnWidths[index + 1]}>{val}</DGRowItem>;
    });
  } else if (imageId) {
    rowVals = (<DGImageCaption colWidth={3}>
      {value ? value : ''}
      <DGImageItem style={{ cursor: 'pointer' }} onClick={showModal.bind([imageId])}>
        <EliteImage imageId={imageId} />
      </DGImageItem>
    </DGImageCaption>);
  }
  return (<DgRowStyle>
    <DGRowTitle colWidth={columnWidths[0]}>{title}</DGRowTitle>
    {rowVals}
  </DgRowStyle>);
}

DgRow.propTypes = {
  columnWidths: PropTypes.array.isRequired,
  title: PropTypes.string,
  value: PropTypes.string,
  values: PropTypes.array,
  imageId: PropTypes.number,
  setModalOpen: PropTypes.func,
  setModalData: PropTypes.func,
  headerDetails: PropTypes.object,
};

DgRow.defaultProps = {
  title: '',
  value: undefined,
  values: undefined,
  imageId: undefined,
  setModalOpen: () => {},
  setModalData: () => {},
  headerDetails: {},
};

function DataGrid({ gridData, setModalOpen, setModalData, headerDetails }) {
  return (
    <DataGridWrapper >
      <DGTitle>{gridData.title}</DGTitle>
      {gridData.rows.map((row) =>
        <DgRow
          {...row}
          columnWidths={gridData.columnWidths}
          setModalOpen={setModalOpen}
          setModalData={setModalData}
          headerDetails={headerDetails}
        />)}
    </DataGridWrapper>
  );
}

DataGrid.propTypes = {
  gridData: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func,
  setModalData: PropTypes.func,
  headerDetails: PropTypes.object,
};

DataGrid.defaultProps = {
  setModalOpen: () => {},
  setModalData: () => {},
  headerDetails: {},
};


export default DataGrid;
