import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import HeaderComponent from 'components/Header';

import { setMobileMenuOpen } from 'globalReducers/app';

import { selectDeviceFormat, selectMobileMenuOpen } from 'selectors/app';
import { selectUser } from '../Authentication/selectors';

class HeaderContainer extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  }

  render() {
    const { user, deviceFormat, mobileMenuOpen } = this.props;

    const options = {
      assignments: 12,
      facilities: ['Sheffield', 'Cloverfield'],
    };

    // if the device is not desktop and user is not logged in, do not render header
    return deviceFormat === 'desktop' || user ?
      <HeaderComponent
        user={user}
        options={options}
        deviceFormat={deviceFormat}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={this.props.setMobileMenuOpen}
      />
      : null;
  }

}

HeaderContainer.propTypes = {
  user: PropTypes.object,
  deviceFormat: PropTypes.string,
  mobileMenuOpen: PropTypes.bool,
  setMobileMenuOpen: PropTypes.func,
};

HeaderContainer.defaultProps = {
  user: undefined,
  deviceFormat: 'desktop',
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
};

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
  deviceFormat: selectDeviceFormat(),
  mobileMenuOpen: selectMobileMenuOpen(),
});

const mapDispatchToProps = {
  setMobileMenuOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
