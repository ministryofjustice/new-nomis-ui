import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './index.scss'

export const ActionLink = ({ url, testId, image, children }) => (
  <div className="action-links__link">
    <a href={url} className="action-link link" data-qa={testId}>
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
  whereaboutsUrl,
  isEstablishmentRollCheck,
  establishmentRollcheckUrl,
  adminUtilitiesUrl,
  hasAdminRights,
  isGlobalSearch,
  globalSearchUrl,
}) => {
  if (
    !isKeyWorker &&
    !isKeyWorkerAdmin &&
    !isWhereabouts &&
    !isEstablishmentRollCheck &&
    !hasAdminRights &&
    !isGlobalSearch
  ) {
    return <div />
  }

  return (
    <div>
      <h1 className="heading-medium">Tasks</h1>
      <div className="action-links">
        {isKeyWorkerAdmin && omicUrl && (
          <ActionLink url={omicUrl} image="/img/manage-key-workers2x.png" testId="manage-kw-link">
            Manage key workers
          </ActionLink>
        )}

        {isKeyWorker && (
          <div className="action-links__link">
            <Link to="/key-worker-allocations" className="action-link link" data-qa="my-kw-allocations-link">
              <img src="/img/ICON_MyKeyWorkerAssignments@2x.png" alt="My key worker allocations icon" />
              My key worker allocations
            </Link>
          </div>
        )}

        {isWhereabouts && whereaboutsUrl && (
          <ActionLink url={whereaboutsUrl} image="/img/ICON_ManagePrisonerWhereabouts.png" testId="whereabouts-link">
            Manage prisoner whereabouts
          </ActionLink>
        )}

        {isEstablishmentRollCheck && establishmentRollcheckUrl && (
          <ActionLink
            url={establishmentRollcheckUrl}
            image="/img/EstablishmentRoll_icon.png"
            testId="establishment-roll-link"
          >
            Establishment roll check
          </ActionLink>
        )}

        {hasAdminRights && adminUtilitiesUrl && (
          <ActionLink url={adminUtilitiesUrl} image="/img/ICON_AdminUtilities.png" testId="admin-utilities-link">
            Admin and utilities
          </ActionLink>
        )}

        {isGlobalSearch && globalSearchUrl && (
          <ActionLink url={globalSearchUrl} image="/img/global-search.png" testId="global-search-link">
            Global search
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
  whereaboutsUrl: PropTypes.string.isRequired,
  isEstablishmentRollCheck: PropTypes.bool.isRequired,
  establishmentRollcheckUrl: PropTypes.string.isRequired,
  adminUtilitiesUrl: PropTypes.string.isRequired,
  hasAdminRights: PropTypes.bool.isRequired,
  isGlobalSearch: PropTypes.bool.isRequired,
  globalSearchUrl: PropTypes.string.isRequired,
}

export default ActionLinks
