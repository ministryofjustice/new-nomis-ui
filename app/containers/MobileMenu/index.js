import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import MobileMenuComponent from '../../components/MobileMenu'

import { setMenuOpen } from '../../globalReducers/app'
import selectUserHeaderInfo from '../Header/selectors'

const MobileMenu = ({ user, setMenuOpen: menuOpen, extraLinks }) => {
  if (!user) {
    return <div />
  }

  return <MobileMenuComponent user={user} setMenuOpen={menuOpen} extraLinks={extraLinks} />
}

MobileMenu.propTypes = {
  user: PropTypes.shape({}),
  setMenuOpen: PropTypes.func.isRequired,
  extraLinks: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

MobileMenu.defaultProps = {
  user: undefined,
}

const mapStateToProps = createStructuredSelector({
  user: selectUserHeaderInfo(),
})

const mapDispatchToProps = {
  setMenuOpen,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileMenu)
