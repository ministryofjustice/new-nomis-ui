import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './index.scss'

export const ActionLink = ({ url, testId, image, children, ...rest }) => (
  <div className="action-links__link">
    <a href={url} className="action-link link" data-qa={testId} {...rest}>
      <img src={image} alt={`${children} icon`} />
      {children}
    </a>
  </div>
)

ActionLink.propTypes = {
  url: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const ActionLinks = ({
  isKeyWorkerAdmin,
  isKeyWorker,
  isWhereabouts,
  omicUrl,
  manageAuthAccountsUrl,
  prisonStaffHubUrl,
  useOfForceUrl,
  pathfinderUrl,
  licencesUrl,
  moicUrl,
  isEstablishmentRollCheck,
  hasAdminRights,
  isGlobalSearch,
  isAddBulkAppointments,
  isCatToolUser,
  categorisationUrl,
  isUseOfForce,
  isPathfinderUser,
  isLicenceUser,
  isPrisonUser,
  isPecsUser,
  pecsUrl,
  isPomAllocUser,
  staffId,
}) => {
  return (
    <div>
      <h1 className="heading-medium">Tasks</h1>
      <div className="action-links">
        {isGlobalSearch && prisonStaffHubUrl && (
          <ActionLink
            url={`${prisonStaffHubUrl}global-search`}
            image="/img/global-search.png"
            testId="global-search-link"
          >
            Global search
          </ActionLink>
        )}

        {isKeyWorker && omicUrl && (
          <ActionLink
            url={`${omicUrl}key-worker/${staffId}`}
            image="/img/ICON_MyKeyWorkerAssignments@2x.png"
            testId="my-kw-allocations-link"
          >
            My key worker allocations
          </ActionLink>
        )}

        {isWhereabouts && prisonStaffHubUrl && (
          <ActionLink
            url={`${prisonStaffHubUrl}manage-prisoner-whereabouts`}
            image="/img/ICON_ManagePrisonerWhereabouts.png"
            testId="whereabouts-link"
          >
            Manage prisoner whereabouts
          </ActionLink>
        )}

        {isPrisonUser && prisonStaffHubUrl && (
          <ActionLink
            url={`${prisonStaffHubUrl}current-covid-units`}
            image="/img/CovidUnits_icon.png"
            testId="covid-units-link"
          >
            View COVID units
          </ActionLink>
        )}

        {isUseOfForce && useOfForceUrl && (
          <ActionLink url={`${useOfForceUrl}`} image="/img/UseOfForce_icon.png" testId="useOfForce-link">
            Use of force incidents
          </ActionLink>
        )}

        {isPathfinderUser && pathfinderUrl && (
          <ActionLink url={`${pathfinderUrl}`} image="/img/Pathfinder_icon.png" testId="pathfinder-link">
            Pathfinder
          </ActionLink>
        )}

        {isLicenceUser && licencesUrl && (
          <ActionLink url={`${licencesUrl}`} image="/img/ICON_Licences.png" testId="licence-link">
            HDC and Licences
          </ActionLink>
        )}

        {isEstablishmentRollCheck && prisonStaffHubUrl && (
          <ActionLink
            url={`${prisonStaffHubUrl}establishment-roll`}
            image="/img/EstablishmentRoll_icon.png"
            testId="establishment-roll-link"
          >
            Establishment roll check
          </ActionLink>
        )}

        {isAddBulkAppointments && prisonStaffHubUrl && (
          <ActionLink
            url={`${prisonStaffHubUrl}bulk-appointments/need-to-upload-file`}
            image="/img/bulk-appointments.png"
            testId="add-bulk-appointments-link"
          >
            Add bulk appointments
          </ActionLink>
        )}

        {isKeyWorkerAdmin && omicUrl && (
          <ActionLink url={`${omicUrl}`} image="/img/ICON_ManageKeyWorkers.png" testId="manage-kw-link">
            Manage key workers
          </ActionLink>
        )}

        {isPomAllocUser && moicUrl && (
          <ActionLink url={moicUrl} image="/img/ICON_POMAllocation.png" testId="pom-alloc-link">
            Manage POM allocation
          </ActionLink>
        )}

        {hasAdminRights && manageAuthAccountsUrl && (
          <ActionLink
            url={`${manageAuthAccountsUrl}`}
            image="/img/ICON_AdminUtilities.png"
            testId="admin-utilities-link"
          >
            Manage user accounts
          </ActionLink>
        )}

        {isCatToolUser && categorisationUrl && (
          <ActionLink url={`${categorisationUrl}`} image="/img/ICON_CatTool.png" testId="cat-tool-link">
            Categorisation
          </ActionLink>
        )}

        {isPecsUser && pecsUrl && (
          <ActionLink url={pecsUrl} image="/img/BookASecureMove_icon.png" target="_blank" rel="noopener noreferrer">
            Book a secure move
          </ActionLink>
        )}
      </div>
    </div>
  )
}

ActionLinks.propTypes = {
  isKeyWorkerAdmin: PropTypes.bool.isRequired,
  isKeyWorker: PropTypes.bool.isRequired,
  isWhereabouts: PropTypes.bool.isRequired,
  omicUrl: PropTypes.string.isRequired,
  manageAuthAccountsUrl: PropTypes.string.isRequired,
  isEstablishmentRollCheck: PropTypes.bool.isRequired,
  hasAdminRights: PropTypes.bool.isRequired,
  isGlobalSearch: PropTypes.bool.isRequired,
  isAddBulkAppointments: PropTypes.bool.isRequired,
  prisonStaffHubUrl: PropTypes.string.isRequired,
  isCatToolUser: PropTypes.bool.isRequired,
  categorisationUrl: PropTypes.string.isRequired,
  isUseOfForce: PropTypes.bool.isRequired,
  useOfForceUrl: PropTypes.string.isRequired,
  isPathfinderUser: PropTypes.bool.isRequired,
  pathfinderUrl: PropTypes.string.isRequired,
  isLicenceUser: PropTypes.bool.isRequired,
  isPecsUser: PropTypes.bool.isRequired,
  licencesUrl: PropTypes.string.isRequired,
  isPomAllocUser: PropTypes.bool.isRequired,
  moicUrl: PropTypes.string.isRequired,
  pecsUrl: PropTypes.string.isRequired,
  staffId: PropTypes.string.isRequired,
}

export default ActionLinks
