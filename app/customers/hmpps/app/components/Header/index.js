import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/Dropdown';
import MenuToggle from 'components/MenuToggle';
import MobileMenu from 'containers/MobileMenu';
import ProductGlobals from 'product-globals';

import { Link } from 'react-router';

import {
DesktopOnly,
MobileOnly,
} from 'components/CommonTheme';

import {
  PageHeader,
  LeftContent,
  RightContent,
  Logo,
  LogoText,
  Title,
  ToggleWrapper,
  UnstyledLink,
} from './header.theme';

class Header extends Component {

  toggleMenu() {
    this.props.setMenuOpen(!this.props.menuOpen);
  }

  render() {
    const { user, menuOpen, switchCaseLoad, showTermsAndConditions } = this.props;
    return (
      <PageHeader>
        <div className="header-content">
          <LeftContent>
          <Link to="/">
            <Logo>
              <img src="/img/Crest@2x.png" alt="" width="42" height="35" />
            </Logo>
          </Link>

          <UnstyledLink to="/">
            <LogoText>HMPPS</LogoText>
            <Title>{ProductGlobals.serviceName}</Title>
          </UnstyledLink>
          </LeftContent>
          <RightContent>
            <DesktopOnly>
              {user && <Dropdown menuOpen={menuOpen} switchCaseLoad={switchCaseLoad} user={user} toggleMenu={() => this.toggleMenu()} /> }
            </DesktopOnly>
            <MobileOnly>
              { user &&
                <ToggleWrapper>
                  <MenuToggle menuOpen={menuOpen} toggleMenu={() => this.toggleMenu()} />
                </ToggleWrapper>
              }
            </MobileOnly>
          </RightContent>
        </div>
        <MobileOnly>
          {menuOpen && <MobileMenu showTerms={showTermsAndConditions} />}
        </MobileOnly>
      </PageHeader>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object,
  menuOpen: PropTypes.bool.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  switchCaseLoad: PropTypes.func.isRequired,
  showTermsAndConditions: PropTypes.func.isRequired,
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
