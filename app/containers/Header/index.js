import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// eslint-disable-next-line import/no-unresolved
import HeaderComponent from 'header'
import { setMenuOpen, navigateTo } from '../../globalReducers/app'
import { userType } from '../../types'

const HeaderContainer = ({ user, menuOpen, setMenuOpen: openMenu, navigateTo: toRoute, prisonStaffHubUrl }) => (
  <HeaderComponent
    user={user}
    menuOpen={menuOpen}
    setMenuOpen={openMenu}
    navigateTo={toRoute}
    extraLinks={
      user.caseLoadOptions && user.caseLoadOptions.length > 1
        ? [{ text: 'Change caseload', url: `${prisonStaffHubUrl}change-caseload/` }]
        : []
    }
  />
)

HeaderContainer.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool,
  setMenuOpen: PropTypes.func,
  user: userType,
  prisonStaffHubUrl: PropTypes.string.isRequired,
}

HeaderContainer.defaultProps = {
  menuOpen: false,
  setMenuOpen: () => {},
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

const mapDispatchToProps = {
  setMenuOpen,
  navigateTo,
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer)
