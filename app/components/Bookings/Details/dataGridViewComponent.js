

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
} from './dataGridViewComponent.theme';

function DgRow({ title, value: v, values, imageId, columnWidths }) {
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
      <DGImageItem>
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
};

DgRow.defaultProps = {
  title: '',
  value: undefined,
  values: undefined,
  imageId: undefined,
};

function DataGrid({ gridData }) {
  return (
    <DataGridWrapper >
      <DGTitle>{gridData.title}</DGTitle>
      {gridData.rows.map((row) => <DgRow {...row} columnWidths={gridData.columnWidths} />)}
    </DataGridWrapper>
  );
}

DataGrid.propTypes = {
  gridData: PropTypes.object.isRequired,
};


export default DataGrid;
