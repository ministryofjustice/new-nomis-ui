import React from 'react'
import PropTypes from 'prop-types'
import { toFullName } from '../../utils/stringUtils'

const Name = ({ firstName, lastName, name }) => <span>{toFullName({ firstName, lastName, name })}</span>

Name.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  name: PropTypes.string,
}

Name.defaultProps = {
  firstName: '',
  lastName: '',
  name: '',
}

export default Name
