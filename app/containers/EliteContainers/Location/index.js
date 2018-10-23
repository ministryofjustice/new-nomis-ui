import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { selectLocation } from './selectors'

class EliteLocation extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  static contextTypes = {
    intl: intlShape.isRequired,
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  render() {
    const { location } = this.props
    return <div>{location.description}</div>
  }
}

const mapStateToProps = createStructuredSelector({
  location: selectLocation(),
})

export default connect(
  mapStateToProps,
  null
)(EliteLocation)
