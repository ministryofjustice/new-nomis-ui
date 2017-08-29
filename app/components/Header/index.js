import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Dropdown from 'components/Dropdown';
import DesktopWrapper from 'components/CommonTheme/DesktopWrapper';
import colours from 'theme/colours';
import SVGLOGO from './svgLogo';

import hamburger from 'assets/hamburger.svg';
import arrowBack from 'assets/back-arrow.svg';

import {
  Base,
  Logo,
  LogoText,
  Title,
  Hamburger,
  ArrowBack
} from './header.theme';

import {
  DesktopOnly,
  MobileOnly
} from 'components/CommonTheme';

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
    const { user, mobileMenuOpen, switchCaseLoad } = this.props;
    return (
      <div>

      <Base>
          <Logo><img src="/img/logo-crest-white.png"/></Logo>
          <LogoText to="/">HMPPS</LogoText>
          <Title>Prison-NOMIS</Title>
          <DesktopOnly>
            {user ? <Dropdown switchCaseLoad={switchCaseLoad} user={user} /> : null }
          </DesktopOnly>
          <MobileOnly>
            { mobileMenuOpen ?
              <ArrowBack onClick={this.menuClick} data-name={'ArrowBack'} svg={arrowBack}/>
                :
              <Link hidden={!user} to={'/mobileMenu'}>
                <Hamburger onClick={this.menuClick} data-name={'Hamburger'} svg={hamburger}/>
              </Link>
            }
          </MobileOnly>
        </Base>
      </div>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object,
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
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
};

export default Header;
