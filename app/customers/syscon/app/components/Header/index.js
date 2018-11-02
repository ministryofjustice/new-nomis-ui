/* eslint-disable import/no-unresolved */
import React from 'react'
import Dropdown from 'components/Dropdown'
import MenuToggle from 'components/MenuToggle'
import MobileMenu from 'containers/MobileMenu'
import PropTypes from 'prop-types'

import './index.scss'

const Header = ({ user, switchCaseLoad, menuOpen, setMenuOpen }) => (
  <div className="banner">
    <div className="header-content">
      <div className="brand-header">
        <span className="section" to="/">
          <img src="/img/Syscon_logo.svg" alt="Syscon logo" />
        </span>

        <span className="section">
          <h1>SYSCON</h1>
        </span>
        <span className="section desktop-only">
          <span className="divider" />
        </span>

        <span className="section desktop-only">
          <h1>Prison Manager</h1>
        </span>
      </div>

      <div className="desktop-menu">
        {user && (
          <Dropdown
            switchCaseLoad={switchCaseLoad}
            user={user}
            menuOpen={menuOpen}
            toggleMenu={() => setMenuOpen(!menuOpen)}
          />
        )}
      </div>

      <div className="mobile-menu">
        {user && <MenuToggle menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />}
      </div>

      <div className="mobile-only">{menuOpen && <MobileMenu />}</div>
    </div>
  </div>
)

Header.propTypes = {
  user: PropTypes.shape({}).isRequired,
  switchCaseLoad: PropTypes.string.isRequired,
  menuOpen: PropTypes.string.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
}

export default Header
