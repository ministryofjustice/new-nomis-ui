import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const DayWithDate = ({ value }) => <span>{moment(value).format('dddd')}</span>

DayWithDate.propTypes = {
  value: PropTypes.string.isRequired,
}

export default DayWithDate
