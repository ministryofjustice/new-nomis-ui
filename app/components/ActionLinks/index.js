import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import './index.scss'

export const KeyWorkerAdminLink = ({ omicUrl }) => (
  <div className="link-box">
    <img src="/img/manage-key-workers2x.png" className="add-gutter-margin-right" alt="Manage keyworkers icon" />

    <div className="heading-medium">
      <a href={omicUrl} className="link clickable">
        Manage key workers
      </a>
    </div>
  </div>
)

KeyWorkerAdminLink.propTypes = {
  omicUrl: PropTypes.string.isRequired,
}

export const MyAllocationsLink = () => (
  <div className="link-box">
    <img
      src="/img/ICON_MyKeyWorkerAssignments@2x.png"
      className="add-gutter-margin-right"
      alt="Keyworker allocation icon"
    />

    <div className="heading-medium">
      <Link className="link my-allocations-link" to="/myKeyWorkerAllocations">
        My key worker allocations
      </Link>
    </div>
  </div>
)

export const WhereaboutsLink = ({ whereaboutsUrl }) => (
  <div className="link-box">
    <img src="/img/ICON_ManagePrisonerWhereabouts.png" className="add-gutter-margin-right" alt="Whereabouts icon" />

    <div className="heading-medium">
      <a href={whereaboutsUrl} className="link clickable">
        Manage prisoner whereabouts
      </a>
    </div>
  </div>
)

WhereaboutsLink.propTypes = {
  whereaboutsUrl: PropTypes.string.isRequired,
}

export const EstablishmentRollCheckLink = ({ establishmentRollCheckUrl }) => (
  <div className="link-box">
    <img src="/img/EstablishmentRoll_icon.png" className="add-gutter-margin-right" alt="Establishment roll icon" />

    <div className="heading-medium">
      <a href={establishmentRollCheckUrl} className="link clickable">
        Establishment roll check
      </a>
    </div>
  </div>
)

EstablishmentRollCheckLink.propTypes = {
  establishmentRollCheckUrl: PropTypes.string.isRequired,
}

const ActionLinks = ({
  isKeyWorkerAdmin,
  isKeyWorker,
  isWhereabouts,
  omicUrl,
  whereaboutsUrl,
  establishmentRollcheckUrl,
}) => {
  if (!isKeyWorker && !isKeyWorkerAdmin && !isWhereabouts && !establishmentRollcheckUrl) {
    return <div />
  }

  return (
    <div className="action-links">
      <h1 className="heading-medium"> Other Tasks </h1>
      <div>
        {isKeyWorkerAdmin &&
          omicUrl && (
            <div className="link-container">
              <KeyWorkerAdminLink omicUrl={omicUrl} />
            </div>
          )}

        {isKeyWorker && (
          <div className="link-container">
            <MyAllocationsLink />
          </div>
        )}

        {isWhereabouts &&
          whereaboutsUrl && (
            <div className="link-container">
              <WhereaboutsLink whereaboutsUrl={whereaboutsUrl} />
            </div>
          )}

        {establishmentRollcheckUrl && (
          <div className="link-container">
            <EstablishmentRollCheckLink establishmentRollCheckUrl={establishmentRollcheckUrl} />
          </div>
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
  establishmentRollcheckUrl: PropTypes.string.isRequired,
}

export default ActionLinks
