import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { BreadcrumbContainer, BreadcrumbList, BreadcrumbListItem } from './Breadcrumb.styles'
import OffenderBreadcrumb from './OffenderBreadcrumb'

const routes = [
  { path: '/offenders', breadcrumb: null },
  { path: '/offenders/:offenderNo', breadcrumb: OffenderBreadcrumb },
  { path: '/offenders/:offenderNo/add-case-note', breadcrumb: 'Add new case note' },
  { path: '/offenders/:offenderNo/add-appointment', breadcrumb: 'Add new appointment' },
  { path: '/offenders/:offenderNo/schedule', breadcrumb: 'Schedule' },
  { path: '/offenders/:offenderNo/:activeTab', breadcrumb: null },
  { path: '/offenders/:offenderNo/case-notes/:caseNoteId', breadcrumb: null },
  { path: '/results', breadcrumb: 'Offender search results' },
]

export const Breadcrumb = ({ breadcrumbs }) => {
  // Pick (pop) the last breadcrumd from the array (also removes it from the array)
  const poppedBreadcrumb = breadcrumbs.pop()

  return (
    <BreadcrumbContainer>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, i, arr) => {
          const parentPageLink = arr.length - 1 === i ? 'breadcrumb-parent-page-link' : null
          return (
            <BreadcrumbListItem key={breadcrumb.key}>
              <Link to={breadcrumb.props.match.url} data-qa={parentPageLink}>
                {breadcrumb}
              </Link>
            </BreadcrumbListItem>
          )
        })}
        <BreadcrumbListItem>{poppedBreadcrumb}</BreadcrumbListItem>
      </BreadcrumbList>
    </BreadcrumbContainer>
  )
}

Breadcrumb.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default withBreadcrumbs(routes)(Breadcrumb)
