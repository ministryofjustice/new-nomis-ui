import styled from 'styled-components';
import colours from 'theme/colours';
import { responsiveCols } from 'components/CommonTheme/responsiveColumns';
import { ButtonLink } from 'components/Button';
import { Link } from 'react-router';

export const QueryForm = styled.form`
  position: relative;
  padding: 15px;
  background: ${colours.filterBlocks.background};
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

`;

export const QueryWrapper = styled.div`
  position: relative;
  padding: 15px;
  background: ${colours.filterBlocks.background};
`;

export const CnffHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const CnffTitle = styled.div`
  font-size: 24px;
  flex-grow: 1;
`;
export const CnffResetButton = styled.div`
  align-self: flex-end;
  color: ${colours.linkColour};
  text-decoration: underline;
  cursor: pointer;
`;
export const CnffRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const CnffItemHolder = styled.div`
  width: ${({ isMobile }) => isMobile ? '100%' : responsiveCols(3.5)};

`;

export const CnffTypeSubTypeHolder = styled.div`
  width: ${({ isMobile, showSource }) => isMobile ? '100%' : showSource ? responsiveCols(7) : responsiveCols(5)};`; // eslint-disable-line

export const DateRange = styled.div`
  width: ${({ isMobile }) => isMobile ? '100%' : responsiveCols(5)};
`;

export const CnffButtonHolder = styled.div`
  width: ${({ isMobile }) => isMobile ? '100%' : null};
  padding-bottom: 30px;
  align-self: flex-end;
`;

export const QueryItemHolder = styled.div`
  width: 17%;
  height: 64px;
  margin: 0px 0px 0px;
  padding: 0px 15px;
  float: left;

  &:not(:nth-child(6n)) {
    border-right: 1px solid #d9d9d9;
  }

  label {
    color: #4D4D4D;
    font-size: 16px;
  }

  querylabel {
    color: #4D4D4D;
    font-size: 16px;
  }

  input {
    height: 40px;
  }

  .Select-control {
    height: 40px;
    display: block;
  }

  .Select-placeholder {
    margin-top: -7px;
  }
`;


export const QueryValue = styled.div`
  position: relative;
  padding-top: 3px;
  font-size: 26px;
  background: ${colours.filterBlocks.background};
`;

export const AddCaseNoteButton = styled.div`
  width: 100%;
  padding: 25px;
  font-size: 38px;
  height: initial !important;
  display: flex;
  margin-top: -30px;
`;

export const OpenFilterForm = styled(ButtonLink)`
  width: 100%;
  font-size: 38px;
  /*height: 100px;
  padding: 21px calc(50% - 154px);*/
`;

export const OpenFilterFormMobile = styled(Link)`
  position: fixed;
  top: 29px;
  right: 100px;
  z-index: 1000;
  width: 35px;
  height: 35px;
  background-image: url('/img/filters-icon-mobile.png');
`;
