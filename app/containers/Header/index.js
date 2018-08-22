import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import HeaderComponent from 'header';

import { setMenuOpen, showTerms } from 'globalReducers/app';
import { selectMobileMenuOpen } from 'selectors/app';
import { switchCaseLoad } from '../EliteApiLoader/actions';
import { selectUserHeaderInfo } from './selectors';


const HeaderContainer = ({ headerUser, menuOpen, switchCaseLoad: switchCL,setMenuOpen: openMenu, showTermsAndConditions }) => (
    <HeaderComponent
      switchCaseLoad={switchCL}
      user={headerUser}
      menuOpen={menuOpen}
      setMenuOpen={openMenu}
      showTermsAndConditions={showTermsAndConditions}
    />
  );


HeaderContainer.contextTypes = {
  intl: intlShape.isRequired,
};

HeaderContainer.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  setMenuOpen: PropTypes.func,
  switchCaseLoad: PropTypes.func.isRequired,
  headerUser: PropTypes.object,
};

HeaderContainer.defaultProps = {
  menuOpen: false,
  setMenuOpen: () => {},
  headerUser: undefined,
};

const mapStateToProps = createStructuredSelector({
  menuOpen: selectMobileMenuOpen(),
  headerUser: selectUserHeaderInfo(),
});

const mapDispatchToProps = {
  setMenuOpen,
  switchCaseLoad,
  showTermsAndConditions: showTerms,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
