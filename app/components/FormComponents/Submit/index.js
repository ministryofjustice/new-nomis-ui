import React from 'react'
import PropTypes from 'prop-types'
import SubmitStyle from './submit.theme'

const Submit = ({ value }) => <SubmitStyle type="submit" value={value} />

Submit.propTypes = {
  value: PropTypes.string,
}

Submit.defaultProps = {
  value: 'Submit',
}

export default Submit
