import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import HeaderComponent from 'header';

import { setMobileMenuOpen } from 'globalReducers/app';
import { selectMobileMenuOpen } from 'selectors/app';
import { switchCaseLoad } from '../EliteApiLoader/actions';
import { selectUserHeaderInfo } from './selectors';

const HeaderContainer = () => ({
  render() {
    const { headerUser, mobileMenuOpen, switchCaseLoad: switchCL } = this.props;

    return (
      <HeaderComponent
        switchCaseLoad={switchCL}
        user={headerUser}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={this.props.setMobileMenuOpen}
      />
    );
  },
})

HeaderContainer.contextTypes = {
  intl: intlShape.isRequired,
};

HeaderContainer.propTypes = {
  mobileMenuOpen: PropTypes.bool,
  setMobileMenuOpen: PropTypes.func,
  switchCaseLoad: PropTypes.func.isRequired,
  headerUser: PropTypes.object,
};

HeaderContainer.defaultProps = {
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  headerUser: undefined,
};

const mapStateToProps = createStructuredSelector({
  mobileMenuOpen: selectMobileMenuOpen(),
  headerUser: selectUserHeaderInfo(),
});

const mapDispatchToProps = {
  setMobileMenuOpen,
  switchCaseLoad,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
