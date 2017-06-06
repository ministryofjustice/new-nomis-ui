import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/Dropdown';
import DesktopWrapper from 'components/CommonTheme/DesktopWrapper';
import colours from 'theme/colours';
import SVGLOGO from './svgLogo';

import hamburger from '../../assets/hamburger.svg';
import arrowBack from '../../assets/back-arrow.svg';

import {
  Base,
  BaseMobile,
  Logo,
  LogoText,
  Title,
  TitleMobile,
  Hamburger,
  ArrowBack,
  // SearchButton,
  // SearchIcon,
  // SearchText,
  // UserMenu,
} from './header.theme';


function Header({ user, options, deviceFormat, mobileMenuOpen, setMobileMenuOpen }) {
  const menuClick = (e) => {
    if (e.currentTarget.dataset.name === 'Hamburger') {
      setMobileMenuOpen(true);
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <DesktopWrapper background={colours.headerColour}>
      { deviceFormat === 'desktop' ?
        <Base>
          <Logo><SVGLOGO /></Logo>
          <LogoText>HMPPS</LogoText>
          <Title href="/">Prison-NOMIS</Title>
          { user ? <Dropdown options={options} user={user} /> : null }
        </Base> :
        <BaseMobile>
          <TitleMobile>Prison-NOMIS</TitleMobile>
          { !mobileMenuOpen ? <Hamburger onClick={menuClick} data-name={'Hamburger'} svg={hamburger} /> : null }
          { mobileMenuOpen ? <ArrowBack onClick={menuClick} data-name={'ArrowBack'} svg={arrowBack} /> : null }
        </BaseMobile>
      }
    </DesktopWrapper>
  );
}

Header.propTypes = {
  user: PropTypes.object,
  options: PropTypes.object,
  deviceFormat: PropTypes.string,
  mobileMenuOpen: PropTypes.bool,
  setMobileMenuOpen: PropTypes.func,
};

Header.defaultProps = {
  user: undefined,
  options: {
    assignments: 12,
    facilities: ['Sheffield', 'Cloverfield'],
  },
  deviceFormat: 'desktop',
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
};

export default Header;
