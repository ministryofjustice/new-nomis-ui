import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

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


class Header extends Component {

  constructor(props) {
    super(props);

    this.menuClick = this.menuClick.bind(this);
  }

  menuClick(e) {
    if (e.currentTarget.dataset.name === 'Hamburger') {
      this.props.setMobileMenuOpen(true);
    } else {
      this.props.setMobileMenuOpen(false);
      this.context.router.goBack();
    }
  }

  render() {
    const { deviceFormat, user, mobileMenuOpen, switchCaseLoad } = this.props;
    return (
      <DesktopWrapper background={colours.headerColour}>
        { deviceFormat === 'desktop' ?
          <Base>
            <Logo><SVGLOGO /></Logo>
            <LogoText to="/">HMPPS</LogoText>
            <Title to="/">Prison-NOMIS</Title>
            { user ? <Dropdown switchCaseLoad={switchCaseLoad} user={user} /> : null }
          </Base> :
          <BaseMobile>
            <TitleMobile>Prison-NOMIS</TitleMobile>
            { !mobileMenuOpen ?
              <Link to={'/mobileMenu'}>
                <Hamburger onClick={this.menuClick} data-name={'Hamburger'} svg={hamburger} />
              </Link> : null }
            { mobileMenuOpen ? <ArrowBack onClick={this.menuClick} data-name={'ArrowBack'} svg={arrowBack} /> : null }
          </BaseMobile>
        }
      </DesktopWrapper>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object,
  deviceFormat: PropTypes.string,
  mobileMenuOpen: PropTypes.bool,
  setMobileMenuOpen: PropTypes.func,
  switchCaseLoad: PropTypes.func.isRequired,
};

Header.contextTypes = {
  router: PropTypes.object.isRequired,
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
