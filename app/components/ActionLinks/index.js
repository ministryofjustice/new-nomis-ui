import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './index.scss'

export const ExternalActionLink = ({ url, testId, image, children }) => (
  <a href={url} className="action-link link" data-qa={testId}>
    <img src={image} alt={`${children} icon`} />
    {children}
  </a>
)

ExternalActionLink.propTypes = {
  url: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const ExternalActionLinks = ({
  isKeyWorkerAdmin,
  isKeyWorker,
  isWhereabouts,
  omicUrl,
  whereaboutsUrl,
  establishmentRollcheckUrl,
  adminUtilitiesUrl,
  hasAdminRights,
}) => {
  if (!isKeyWorker && !isKeyWorkerAdmin && !isWhereabouts && !establishmentRollcheckUrl && !adminUtilitiesUrl) {
    return <div />
  }

  return (
    <div>
      <h1 className="heading-medium">Other Tasks</h1>
      <div className="action-links">
        {isKeyWorkerAdmin && omicUrl && (
          <div className="action-links__link">
            <ExternalActionLink url={omicUrl} image="/img/manage-key-workers2x.png" testId="manage-kw-link">
              Manage key workers
            </ExternalActionLink>
          </div>
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
          <div className="action-links__link">
            <ExternalActionLink
              url={whereaboutsUrl}
              image="/img/ICON_ManagePrisonerWhereabouts.png"
              testId="whereabouts-link"
            >
              Manage prisoner whereabouts
            </ExternalActionLink>
          </div>
        )}

        {establishmentRollcheckUrl && (
          <div className="action-links__link">
            <ExternalActionLink
              url={establishmentRollcheckUrl}
              image="/img/EstablishmentRoll_icon.png"
              testId="establishment-roll-link"
            >
              Establishment roll check
            </ExternalActionLink>
          </div>
        )}

        {hasAdminRights && adminUtilitiesUrl && (
          <div className="action-links__link">
            <ExternalActionLink
              url={adminUtilitiesUrl}
              image="/img/ICON_AdminUtilities.png"
              testId="admin-utilities-link"
            >
              Admin and utilities
            </ExternalActionLink>
          </div>
        )}
      </div>
    </div>
  )
}

ExternalActionLinks.propTypes = {
  isKeyWorkerAdmin: PropTypes.bool.isRequired,
  isKeyWorker: PropTypes.bool.isRequired,
  isWhereabouts: PropTypes.bool.isRequired,
  omicUrl: PropTypes.string.isRequired,
  whereaboutsUrl: PropTypes.string.isRequired,
  establishmentRollcheckUrl: PropTypes.string.isRequired,
  adminUtilitiesUrl: PropTypes.string.isRequired,
  hasAdminRights: PropTypes.bool.isRequired,
}

export default ExternalActionLinks
