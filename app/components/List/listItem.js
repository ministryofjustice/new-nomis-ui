import styled from 'styled-components';
import colours from 'theme/colours';
// import desktop from 'theme/desktop';
// import { Link } from 'react-router';

const bordersBetween = ({ top, mids, bottom } = { top: true, mids: true, bottom: true }, borderString) => {
  if (top && mids && bottom) {
    return ` border-top: ${borderString};
      &:last-of-type {
        border-bottom: ${borderString};
      }`;
  } else if (top && mids) {
    return `border-top: ${borderString};`;
  } else if (bottom && mids) {
    return `border-bottom: ${borderString};`;
  } else if (top && bottom) {
    return `&:first-of-type {
        border-top: ${borderString};
      }
      &:last-of-type {
        border-bottom: ${borderString};
      }`;
  } else if (top) {
    return `&:first-of-type {
            border-top: ${borderString};
          };`;
  } else if (bottom) {
    return `&:last-of-type {
            border-bottom: ${borderString};
          };`;
  }
  return `&:not(:last-of-type) {
      border-top: ${borderString};
    };`;
};

export const ListDetailItem = styled.div`
  align-items: flex-end;
  cursor: pointer;
  display: flex;
  /*height: 130px;*/
  padding-top: 22px;
  padding-bottom: 17px;

  ${
    ({ BordersBetween }) => bordersBetween(BordersBetween, `${colours.bookings.searchResults.borderColour} solid 1px`)
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
