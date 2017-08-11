import React from 'react';
import PropTypes from 'prop-types';

import { PrevNextNavContainer, PrevNextNavWrapper, PrevNavigatorRegion, NextNavigatorRegion, NavigatorContent, VisuallyHiddenSpan, PageNumbers } from './theme';

function PreviousNextNavigation({ pagination, totalRecords, pageAction }) {
  const { perPage: pP, pageNumber: pN } = pagination;
  const totalPages = Math.ceil(totalRecords / (pP));

  return (
    <PrevNextNavContainer show={totalPages > 1}>
      <PrevNextNavWrapper>
        {pN > 0 ? <GetPrevNavigationRegion pN={pN} pageAction={pageAction} totalPages={totalPages}/> : <PrevNavigatorRegion/>}
        {pN < (totalPages - 1) ? <GetNextNavigationRegion pN={pN} pageAction={pageAction} totalPages={totalPages}/> : <NextNavigatorRegion/>}
      </PrevNextNavWrapper>
    </PrevNextNavContainer>
  );
}


const GetPrevNavigationRegion = ({pN,pageAction,totalPages}) =>
  (<PrevNavigatorRegion show={true} onClick={() => { pageAction(pN - 1); }}>
    <NavigatorContent>
      Previous
      <VisuallyHiddenSpan>page</VisuallyHiddenSpan>
      <PageNumbers>{pN} of {totalPages}</PageNumbers>
    </NavigatorContent>
  </PrevNavigatorRegion>)

const GetNextNavigationRegion = ({pN,pageAction,totalPages}) =>
  (<NextNavigatorRegion show={true} onClick={() => { pageAction(pN + 1); }}>
    <NavigatorContent>
      Next
      <VisuallyHiddenSpan>page</VisuallyHiddenSpan>
      <PageNumbers>{pN + 2} of {totalPages}</PageNumbers>
    </NavigatorContent>
  </NextNavigatorRegion>)



PreviousNextNavigation.propTypes = {
  pagination: PropTypes.object.isRequired,
  totalRecords: PropTypes.number.isRequired,
  pageAction: PropTypes.func.isRequired,
};

PreviousNextNavigation.defaultProps = {
};

export default PreviousNextNavigation;
