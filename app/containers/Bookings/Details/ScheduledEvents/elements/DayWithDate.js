import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const DayWithDate = ({ value }) => <Fragment>{moment(value).format('dddd')}</Fragment>

DayWithDate.propTypes = {
  value: PropTypes.string.isRequired,
}

export default DayWithDate
