import React from 'react';
import PropTypes from 'prop-types';

import './toggle.scss';

function MenuToggle({ menuOpen, toggleMenu }) {
  return (
      <div id="nav-icon" onClick={toggleMenu} className={menuOpen ? 'open' : ''}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
  );
}

MenuToggle.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

MenuToggle.defaultProps = {
  menuOpen: false,
  toggleMenu: () => {},
};

export default MenuToggle;
