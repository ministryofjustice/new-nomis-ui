import React from 'react'
import PropTypes from 'prop-types'

import './toggle.scss'
import { linkOnClick } from '../../helpers'

function MenuToggle({ menuOpen, toggleMenu }) {
  return (
    <div id="nav-icon" {...linkOnClick(toggleMenu)} className={menuOpen ? 'open' : ''}>
      <span />
      <span />
      <span />
      <span />
    </div>
  )
}

MenuToggle.propTypes = {
  menuOpen: PropTypes.bool,
  toggleMenu: PropTypes.func,
}

MenuToggle.defaultProps = {
  menuOpen: false,
  toggleMenu: () => {},
}

export default MenuToggle
