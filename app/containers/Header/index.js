import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import HeaderComponent from 'components/Header';

import { setMobileMenuOpen } from 'globalReducers/app';

import { selectDeviceFormat, selectMobileMenuOpen } from 'selectors/app';
import { switchCaseLoad } from '../EliteApiLoader/actions';

import { selectUserHeaderInfo } from './selectors';

class HeaderContainer extends Component {

  render() {
    const { headerUser, deviceFormat, mobileMenuOpen, switchCaseLoad: switchCL } = this.props;

    return (
      <HeaderComponent
        switchCaseLoad={switchCL}
        user={headerUser}
        deviceFormat={deviceFormat}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={this.props.setMobileMenuOpen} />
    );
  }
}

HeaderContainer.contextTypes = {
  intl: intlShape.isRequired,
};

HeaderContainer.propTypes = {
  deviceFormat: PropTypes.string,
  mobileMenuOpen: PropTypes.bool,
  setMobileMenuOpen: PropTypes.func,
  switchCaseLoad: PropTypes.func.isRequired,
  headerUser: PropTypes.object,
};

HeaderContainer.defaultProps = {
  deviceFormat: 'desktop',
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  headerUser: undefined,
};

const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
  mobileMenuOpen: selectMobileMenuOpen(),
  headerUser: selectUserHeaderInfo(),
});

const mapDispatchToProps = {
  setMobileMenuOpen,
  switchCaseLoad,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
