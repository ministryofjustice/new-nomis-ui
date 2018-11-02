import React from 'react'
import PropTypes from 'prop-types'

const DisplayValue = ({ value }) => <span> {value || '--'} </span>

DisplayValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

DisplayValue.defaultProps = {
  value: null,
}

export default DisplayValue
