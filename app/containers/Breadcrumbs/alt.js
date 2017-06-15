import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BreadcrumbsComponent from 'components/Breadcrumbs';

import { setMobileMenuOpen } from 'globalReducers/app';

import { selectDeviceFormat, selectMobileMenuOpen } from 'selectors/app';
import { selectHeaderDetail } from 'containers/Bookings/selectors';
import { selectUser } from '../Authentication/selectors';

class BreadcrumbsAlt extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  }

  render() {
    const { user, deviceFormat, route, headerDetails } = this.props;

    // if the device is not desktop and user is not logged in, do not render header
    return deviceFormat === 'desktop' && user ?
      <BreadcrumbsComponent route={route} inmateData={headerDetails} />
      : null;
  }

}

BreadcrumbsAlt.propTypes = {
  user: PropTypes.object,
  deviceFormat: PropTypes.string,
  route: PropTypes.string.isRequired,
  headerDetails: PropTypes.object.isRequired,
};

BreadcrumbsAlt.defaultProps = {
  user: undefined,
  deviceFormat: 'desktop',
};

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
  deviceFormat: selectDeviceFormat(),
  mobileMenuOpen: selectMobileMenuOpen(),
  headerDetails: selectHeaderDetail(),
});

const mapDispatchToProps = {
  setMobileMenuOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(BreadcrumbsAlt);
