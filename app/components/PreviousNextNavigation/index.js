import React from 'react'
import PropTypes from 'prop-types'

import {
  PrevNextNavContainer,
  PrevNextNavWrapper,
  PrevNavigatorRegion,
  NextNavigatorRegion,
  NavigatorContent,
  VisuallyHiddenSpan,
  PageNumbers,
} from './theme'

export const paginationType = PropTypes.shape({
  perPage: PropTypes.number.isRequired,
  pageNumber: PropTypes.number.isRequired,
})

const PreviousNextNavigation = ({ pagination, totalRecords, pageAction }) => {
  const { perPage, pageNumber } = pagination
  const pP = Number(perPage)
  const pN = Number(pageNumber)

  const totalPages = Math.ceil(totalRecords / pP)

  return (
    <PrevNextNavContainer show={totalPages > 1}>
      <PrevNextNavWrapper>
        {pN > 0 ? (
          <GetPrevNavigationRegion pN={pN} pageAction={pageAction} totalPages={totalPages} />
        ) : (
          <PrevNavigatorRegion />
        )}
        {pN < totalPages - 1 ? (
          <GetNextNavigationRegion pN={pN} pageAction={pageAction} totalPages={totalPages} />
        ) : (
          <NextNavigatorRegion />
        )}
      </PrevNextNavWrapper>
    </PrevNextNavContainer>
  )
}

PreviousNextNavigation.propTypes = {
  pagination: paginationType,
  totalRecords: PropTypes.number,
  pageAction: PropTypes.func,
}

PreviousNextNavigation.defaultProps = {
  pagination: {
    perPage: 10,
    pageNumber: 0,
  },
  totalRecords: 0,
  pageAction: () => {},
}

const GetPrevNavigationRegion = ({ pN, pageAction, totalPages }) => (
  <PrevNavigatorRegion
    id="previous-page"
    role="button"
    show
    onClick={() => {
      pageAction(pN - 1)
    }}
  >
    <NavigatorContent>
      Previous
      <VisuallyHiddenSpan>page</VisuallyHiddenSpan>
      <PageNumbers>
        {pN} of {totalPages}
      </PageNumbers>
    </NavigatorContent>
  </PrevNavigatorRegion>
)

GetPrevNavigationRegion.propTypes = {
  totalPages: PropTypes.number.isRequired,
  pN: PropTypes.number.isRequired,
  pageAction: PropTypes.func.isRequired,
}

const GetNextNavigationRegion = ({ pN, pageAction, totalPages }) => (
  <NextNavigatorRegion
    id="next-page"
    role="button"
    show
    onClick={() => {
      pageAction(pN + 1)
    }}
  >
    <NavigatorContent>
      Next
      <VisuallyHiddenSpan>page</VisuallyHiddenSpan>
      <PageNumbers>
        {pN + 2} of {totalPages}
      </PageNumbers>
    </NavigatorContent>
  </NextNavigatorRegion>
)

GetNextNavigationRegion.propTypes = {
  totalPages: PropTypes.number.isRequired,
  pN: PropTypes.number.isRequired,
  pageAction: PropTypes.func.isRequired,
}

export default PreviousNextNavigation
