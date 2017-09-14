import React from 'react';
import PropTypes from 'prop-types';

import {
  NavLinkLink,
  NavLinkWrapper,
} from './theme';

function NavLink({ route, text }) {
  return (
    <NavLinkWrapper>
      <NavLinkLink to={route}>{text}</NavLinkLink>
    </NavLinkWrapper>
  );
}

NavLink.propTypes = {
  route: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default NavLink;
