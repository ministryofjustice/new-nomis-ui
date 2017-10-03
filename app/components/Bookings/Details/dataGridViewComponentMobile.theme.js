import styled from 'styled-components';
import colours from 'theme/colours';
import { responsiveCols } from 'components/CommonTheme/responsiveColumns';

export const DataGridWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  margin-bottom: 20px;
  padding: 0px 25px;
`;

export const DGTitle = styled.div`
  font-size: 20px;
  width: 100%;
  margin-bottom:15px;
`;

export const DGRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border-bottom: 1px solid ${colours.bookings.details.datagrid.gridLineColour};
  ${''/* &:not(:last-child){
    border-bottom: 1px solid grey;
  } */}
`;

export const DGRowTitle = styled.div`
  width: ${({ colWidth }) => responsiveCols(colWidth)};
  font-size: 15px;
`;

export const DGRowItem = styled.div`
  width: ${({ colWidth }) => responsiveCols(colWidth)};
  font-weight: bold;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const DGImageCaption = styled.div`
  width: ${({ colWidth }) => responsiveCols(colWidth)};
  display: flex;
  flex-direction: column;
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 16px;
`;

export const DGImageItem = styled.div`
  width: 100px;
  height: 150px;
`;
