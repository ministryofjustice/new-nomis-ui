import React from 'react';
import PropTypes from 'prop-types';

// import { PaginateWrapper } from 'components/DesktopWrappers';

import {
  PaginateItem,
  PaginateWrapper,
} from './pagination.theme';


function Pagination({ pagination, totalRecords, pageAction }) {
  const { perPage: pP, pageNumber: pN } = pagination;
  let pageIndexedArray = Array(Math.ceil(totalRecords / (pP))).fill(0).map((_, id) => id);

  const pageAmount = Math.ceil(totalRecords / (pP));

  if (pageAmount > 7) {
    if (pN <= 2) {
      pageIndexedArray = [0, 1, 2, 3, 4, '...', pageAmount - 1];
    } else if (pN === 3) {
      pageIndexedArray = [0, 1, 2, 3, 4, 5, '...', pageAmount - 1];
    } else if (pN >= pageAmount - 3) {
      pageIndexedArray = [0, '...', pageAmount - 5, pageAmount - 4, pageAmount - 3, pageAmount - 2, pageAmount - 1];
    } else if (pN === pageAmount - 4) {
      pageIndexedArray = [0, '...', pageAmount - 6, pageAmount - 5, pageAmount - 4, pageAmount - 3, pageAmount - 2, pageAmount - 1];
    } else {
      pageIndexedArray = [0, '...', pN - 2, pN - 1, pN, pN + 1, pN + 2, '...', pageAmount - 1];
    }
  }

  let i = 0;

  return (
    <PaginateWrapper>
      {pageIndexedArray.map((id) => {
        i += 1;
        return id === '...' ? <PaginateItem key={i} active={id === pN} >{id}</PaginateItem>
        : <PaginateItem key={i} active={id === pN} onClick={() => { pageAction(id); }}>{id + 1}</PaginateItem>;
      })}
    </PaginateWrapper>
  );
}

Pagination.propTypes = {
  pagination: PropTypes.object.isRequired,
  totalRecords: PropTypes.number.isRequired,
  pageAction: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
};

export default Pagination;
