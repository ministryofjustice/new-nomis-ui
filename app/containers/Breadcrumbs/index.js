import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BreadcrumbsComponent from 'components/Breadcrumbs';

import { setMobileMenuOpen } from 'globalReducers/app';

import { selectDeviceFormat, selectMobileMenuOpen } from 'selectors/app';
import { selectUser } from '../Authentication/selectors';

class Breadcrumbs extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  }

  render() {
    const { user, deviceFormat, route } = this.props;

    // if the device is not desktop and user is not logged in, do not render header
    return deviceFormat === 'desktop' && user ?
      <BreadcrumbsComponent route={route} inmateData={{}} />
      : null;
  }

}

Breadcrumbs.propTypes = {
  user: PropTypes.object,
  deviceFormat: PropTypes.string,
  route: PropTypes.string.isRequired,
};

Breadcrumbs.defaultProps = {
  user: undefined,
  deviceFormat: 'desktop',
};

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
  deviceFormat: selectDeviceFormat(),
  mobileMenuOpen: selectMobileMenuOpen(),
});

const mapDispatchToProps = {
  setMobileMenuOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
