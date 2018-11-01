import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { toFullName } from '../../../utils/stringUtils'
import { loadOfficer } from '../../EliteApiLoader/actions'
import selectOfficerName from './selectors'

class EliteOfficerName extends PureComponent {
  componentDidMount() {
    const { boundLoadOfficer } = this.props
    boundLoadOfficer()
  }

  render() {
    const { name } = this.props

    if (name.firstName || name.lastName) {
      return <span>{toFullName(name) || '--'}</span>
    }
    return <span>{name.staffId || '--'}</span>
  }
}

EliteOfficerName.propTypes = {
  name: PropTypes.shape({ firstName: PropTypes.string, lastName: PropTypes.string, staffId: PropTypes.number })
    .isRequired,
  boundLoadOfficer: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch, props) => ({
  boundLoadOfficer: () => {
    dispatch(loadOfficer(props.staffId, props.username))
  },
})

const mapStateToProps = createStructuredSelector({
  name: selectOfficerName(),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EliteOfficerName)
