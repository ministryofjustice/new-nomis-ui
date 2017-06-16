import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Modal from 'containers/Modal';
import Header from 'containers/Header';
import Breadcrumbs from 'containers/Breadcrumbs';
import BreadcrumbsAlt from 'containers/Breadcrumbs/alt';
// import MobileMenu from 'containers/MobileMenu';
import Footer from 'containers/Footer';

import { setDeviceFormat } from 'globalReducers/app';
import { selectDeviceFormat } from 'selectors/app';

class App extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.resizeWindow = this.resizeWindow.bind(this);
    window.addEventListener('resize', this.resizeWindow, true);
  }

  resizeWindow() {
    if (window.innerWidth >= 768) {
      this.props.setDeviceFormat('desktop');
    } else {
      this.props.setDeviceFormat('mobile');
    }
  }

  render() {
    const { deviceFormat } = this.props;
    this.resizeWindow();

    return (
      <div>
        <Helmet title="P-Nomis">
          <meta name="viewport" content="width=device-width, initial-scale=0.5" />
        </Helmet>
        <Modal />
        <Header />
        { this.props.router.location.pathname !== '/bookings/details' ?
          <Breadcrumbs route={this.props.router.location.pathname} /> :
          <BreadcrumbsAlt route={this.props.router.location.pathname} />
        }
        {React.Children.toArray(this.props.children)}
        { deviceFormat === 'desktop' ? <Footer /> : null }
      </div>
    );
  }
}

App.propTypes = {
  deviceFormat: PropTypes.string.isRequired,
  children: PropTypes.node,
  setDeviceFormat: PropTypes.func,
  router: PropTypes.object.isRequired,
};

App.defaultProps = {
  children: [],
  setDeviceFormat: () => {},
};

const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
});

const mapDispatchToProps = (dispatch) => ({
  setDeviceFormat: (format) => dispatch(setDeviceFormat(format)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
