import styled from 'styled-components';
import colours from 'theme/colours';
// import desktop from 'theme/desktop';
import { Link } from 'react-router';

export const ListDetailItem = styled(Link)`
  align-items: flex-end;
  border-top: ${colours.bookings.searchResults.borderColour} solid 1px;
  cursor: pointer;
  display: flex;
  /*height: 130px;*/
  padding-top: 22px;
  padding-bottom: 17px;

  &:last-of-type {
    border-bottom: ${colours.bookings.searchResults.borderColour} solid 1px;
    /*height: 131px;*/
  }

  &>div {
    &:not(:first-child) {
      margin-left: calc( 100% * 15 / 1170 );
    }
    &:not(:last-child) {
      margin-right: calc( 100% * 15 / 1170 );
    }
  }

  &:hover {
    background: ${colours.filterBlocks.background};
    border-color: ${colours.filterBlocks.background};
    margin: 0 -15px;
    padding-left: 15px;
    padding-right: 15px;
    width: calc(100% + 30px);
  }

  &:hover+div {
    border: none;
  }
`;
