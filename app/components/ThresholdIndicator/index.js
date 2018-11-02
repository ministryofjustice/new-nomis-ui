import React from 'react'

import './index.scss'
import PropTypes from 'prop-types'

const ThresholdIndicator = ({ maximum, value }) => {
  let level

  if (maximum) {
    if (!value) {
      level = 'none'
    } else if (value < maximum) {
      level = 'low'
    } else if (value === maximum) {
      level = 'medium'
    } else if (value > maximum) {
      level = 'high'
    }
  }

  return (
    <span className="threshold-indicator">
      <span className={level}> {value} </span>
    </span>
  )
}

ThresholdIndicator.propTypes = {
  maximum: PropTypes.number,
  value: PropTypes.number,
}

ThresholdIndicator.defaultProps = {
  maximum: 0,
  value: 0,
}

export default ThresholdIndicator
