import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// eslint-disable-next-line import/no-unresolved
import HeaderComponent from 'header'
import { setMenuOpen, navigateTo } from '../../globalReducers/app'
import { switchCaseLoad } from '../EliteApiLoader/actions'
import { userType } from '../../types'

const HeaderContainer = ({ user, menuOpen, switchCaseLoad: switchCL, setMenuOpen: openMenu, navigateTo: toRoute }) => (
  <HeaderComponent
    switchCaseLoad={switchCL}
    user={user}
    menuOpen={menuOpen}
    setMenuOpen={openMenu}
    navigateTo={toRoute}
  />
)

HeaderContainer.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool,
  setMenuOpen: PropTypes.func,
  switchCaseLoad: PropTypes.func.isRequired,
  user: userType,
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
  switchCaseLoad,
  navigateTo,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContainer)
