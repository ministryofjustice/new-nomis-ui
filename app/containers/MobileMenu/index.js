import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import MobileMenuComponent from '../../components/MobileMenu'

import { setMenuOpen } from '../../globalReducers/app'
import selectUserHeaderInfo from '../Header/selectors'
import { switchCaseLoad } from '../EliteApiLoader/actions'

const MobileMenu = ({ user, switchCaseLoad: switchLoad, setMenuOpen: menuOpen }) => {
  if (!user) {
    return <div />
  }

  return <MobileMenuComponent switchCaseLoad={switchLoad} user={user} setMenuOpen={menuOpen} />
}

MobileMenu.propTypes = {
  user: PropTypes.shape({}),
  setMenuOpen: PropTypes.func.isRequired,
  switchCaseLoad: PropTypes.func.isRequired,
}

MobileMenu.defaultProps = {
  user: undefined,
}

const mapStateToProps = createStructuredSelector({
  user: selectUserHeaderInfo(),
})

const mapDispatchToProps = {
  setMenuOpen,
  switchCaseLoad,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileMenu)
