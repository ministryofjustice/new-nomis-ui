import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import HeaderComponent from '../../components/Header'
import { userType } from '../../types'

const HeaderContainer = ({ user, menuOpen, setMenuOpen, prisonStaffHubUrl }) => (
  <HeaderComponent
    user={user}
    menuOpen={menuOpen}
    setMenuOpen={setMenuOpen}
    extraLinks={
      user.caseLoadOptions && user.caseLoadOptions.length > 1
        ? [{ text: 'Change caseload', url: `${prisonStaffHubUrl}change-caseload/` }]
        : []
    }
  />
)

HeaderContainer.propTypes = {
  menuOpen: PropTypes.bool,
  user: userType,
  prisonStaffHubUrl: PropTypes.string.isRequired,
}

HeaderContainer.defaultProps = {
  menuOpen: false,
  user: undefined,
}

const mapStateToProps = state => {
  const caseLoadOptions = state.getIn(['eliteApiLoader', 'User', 'CaseLoads', 'Data'])
  const user = state.getIn(['authentication', 'user'])

  return {
    menuOpen: state.getIn(['app', 'mobileMenuOpen']),
    user: {
      ...user,
      caseLoadOptions: (caseLoadOptions && caseLoadOptions.toJS()) || [],
    },
  }
}

export default connect(mapStateToProps)(HeaderContainer)
