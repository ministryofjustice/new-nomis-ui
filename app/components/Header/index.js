import React from 'react';
import PropTypes from 'prop-types';

import DesktopWrapper from 'components/CommonTheme/DesktopWrapper';
import colours from 'theme/colours';
import SVGLOGO from './svgLogo';

import {
  Base,
  Logo,
  LogoText,
  Title,
  // SearchButton,
  // SearchIcon,
  // SearchText,
  // UserMenu,
} from './header.theme';


function Header({ menuComponent }) {
  return (
    <DesktopWrapper background={colours.headerColour}>
      <Base>
        <Logo><SVGLOGO /></Logo>
        <LogoText>HMPPS</LogoText>
        <Title>Prison-NOMIS</Title>
        {/* <SearchButton>
          <SearchIcon />
          <SearchText></SearchText>
        </SearchButton>
        <UserMenu /> */}
        {menuComponent}
      </Base>
    </DesktopWrapper>
  );
}

Header.propTypes = {
  menuComponent: PropTypes.node,
  // LeftIcon: PropTypes.element,
  // Title: PropTypes.element,
  // RightIcon: PropTypes.element,
};

Header.defaultProps = {
  menuComponent: null,
};

export default Header;
