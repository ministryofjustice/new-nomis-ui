  import React, { Component } from 'react';
  import PropTypes from 'prop-types';

  import Dropdown from 'components/Dropdown';
  import MenuToggle from 'components/MenuToggle';
  import ProductGlobals from 'product-globals';

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
} from './header.theme';

  class Header extends Component {

    constructor(props) {
      super(props);

      this.openMenu = this.openMenu.bind(this);
      this.closeMenu = this.closeMenu.bind(this);
    }

    openMenu() {
      this.props.setMobileMenuOpen(true);
    }

    closeMenu() {
      this.props.setMobileMenuOpen(false);
    }

    render() {
      const { user, mobileMenuOpen, switchCaseLoad } = this.props;
      return (
      <PageHeader>
        <div className="header-content">
          <LeftContent>
            <Logo className="header-image">
            </Logo>
            <LogoText to="/">HMPPS</LogoText>
            <Title>{ProductGlobals.serviceName}</Title>
          </LeftContent>
          <RightContent>
            <DesktopOnly>
              {user && <Dropdown switchCaseLoad={switchCaseLoad} user={user} /> }
            </DesktopOnly>
            <MobileOnly>
              { user &&
                <ToggleWrapper>
                  <MenuToggle toggleState={mobileMenuOpen} onToggle={mobileMenuOpen ? this.closeMenu : this.openMenu} />
                </ToggleWrapper>
              }
            </MobileOnly>
          </RightContent>
        </div>
      </PageHeader>
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
