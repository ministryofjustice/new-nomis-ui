import styled from 'styled-components';
import colours from 'theme/colours';
// import desktop from 'theme/desktop';
import { responsiveCols } from 'components/CommonTheme/responsiveColumns';

export const DataGridWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  margin-bottom: 25px;
  padding: 0px 25px;
`;

export const DGTitle = styled.div`
  font-size: 40px;
  width: 100%;
  margin-bottom:30px;
`;

export const DGRow = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 99px;;
  width: 100%;
  border-bottom: 1px solid ${colours.bookings.details.datagrid.gridLineColour};
  ${''/* &:not(:last-child){
    border-bottom: 1px solid grey;
  } */}
`;

export const DGRowTitle = styled.div`
  width: ${({ colWidth }) => responsiveCols(colWidth)};
  font-size: 30px;
`;

export const DGRowItem = styled.div`
  width: ${({ colWidth }) => responsiveCols(colWidth)};
  font-weight: bold;
  font-size: 32px;
`;

export const DGImageCaption = styled.div`
  width: ${({ colWidth }) => responsiveCols(colWidth)};
  display: flex;
  flex-direction: column;
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 32px;
`;

export const DGImageItem = styled.div`
  width: 100px;
  height: 150px;
`;
