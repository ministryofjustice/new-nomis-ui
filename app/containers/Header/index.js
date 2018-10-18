import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';

import HeaderComponent from 'header';
import { setMenuOpen, showTerms, navigateTo } from 'globalReducers/app';
import { switchCaseLoad } from '../EliteApiLoader/actions';


const HeaderContainer = ({ user, menuOpen, switchCaseLoad: switchCL,setMenuOpen: openMenu, showTermsAndConditions, navigateTo: toRoute }) => (
    <HeaderComponent
      switchCaseLoad={switchCL}
      user={user}
      menuOpen={menuOpen}
      setMenuOpen={openMenu}
      showTermsAndConditions={showTermsAndConditions}
      navigateTo={toRoute}
    />
  );


HeaderContainer.contextTypes = {
  intl: intlShape.isRequired,
};

HeaderContainer.propTypes = {
  menuOpen: PropTypes.bool,
  setMenuOpen: PropTypes.func,
  switchCaseLoad: PropTypes.func.isRequired,
  user: PropTypes.object,
};

HeaderContainer.defaultProps = {
  menuOpen: false,
  setMenuOpen: () => {},
  user: undefined,
};

const mapStateToProps = state => {
  const caseLoadOptions = state.getIn(['eliteApiLoader', 'User', 'CaseLoads', 'Data']);
  const user = state.getIn(['authentication', 'user']);

  return ({
    menuOpen: state.getIn(['app', 'mobileMenuOpen']),
    user: {
      ...user,
      caseLoadOptions: (caseLoadOptions && caseLoadOptions.toJS()) || [],
    },
  });
};

const mapDispatchToProps = {
  setMenuOpen,
  switchCaseLoad,
  navigateTo,
  showTermsAndConditions: showTerms,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
