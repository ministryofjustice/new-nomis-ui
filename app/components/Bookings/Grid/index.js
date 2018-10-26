import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import React from 'react'

import EliteImage from 'containers/EliteContainers/Image'
import { offenderImageUrl } from 'containers/Bookings/constants'

import Name from 'components/Name'

import './index.scss'
import { linkOnClick } from '../../../helpers'

const Grid = ({ results, viewDetails }) => (
  <div className="booking-grid">
    <div className="grid">
      {results.map(row => (
        <div className="grid-item" key={`booking_grid_${row.get('offenderNo')}`}>
          <div className="person-block">
            <div className="grid-photo" {...linkOnClick(() => viewDetails(row.get('offenderNo')))}>
              <EliteImage src={offenderImageUrl(row.get('facialImageId'))} />
            </div>

            <div className="person-details">
              <div className="person-name bold">
                <Name lastName={row.get('lastName')} firstName={row.get('firstName')} />
              </div>

              <div className="ancillary-text">{row.get('offenderNo')}</div>

              <div className="ancillary-text">{row.get('assignedLivingUnitDesc')}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

Grid.propTypes = {
  results: ImmutablePropTypes.list.isRequired,
  viewDetails: PropTypes.func.isRequired,
}

export default Grid
