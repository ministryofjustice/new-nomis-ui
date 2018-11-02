import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import selectLocation from './selectors'

class EliteLocation extends PureComponent {
  render() {
    const { location } = this.props
    return <div>{location.description}</div>
  }
}

EliteLocation.propTypes = {
  location: PropTypes.shape({ description: PropTypes.string.isRequired }).isRequired,
}

const mapStateToProps = createStructuredSelector({
  location: selectLocation(),
})

export default connect(
  mapStateToProps,
  null
)(EliteLocation)
