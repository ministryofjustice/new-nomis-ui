import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setDeviceFormat } from 'globalReducers/app';
import { selectMobileMenuOpen } from 'selectors/app';
import Modal from 'containers/Modal';
import Header from 'containers/Header';
import Breadcrumbs from 'containers/Breadcrumbs';
import BreadcrumbsAlt from 'containers/Breadcrumbs/alt';
import MobileMenu from 'containers/MobileMenu';
import Footer from 'containers/Footer';

class App extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.resizeWindow = this.resizeWindow.bind(this);
    window.addEventListener('resize', this.resizeWindow, true);
  }

  componentWillMount() {
    this.resizeWindow();
  }

  resizeWindow() {
    if (window.innerWidth > 1024) {
      this.props.setDeviceFormat('desktop');
    } else {
      this.props.setDeviceFormat('mobile');
    }
  }

  render() {
    const { mobileMenuOpen } = this.props;

    if (mobileMenuOpen) {
      return (
        <div className="app-content">
          <Helmet title="P-Nomis" />
          <Header />
          <MobileMenu />
        </div>
      );
    }

    return (
      <div className="app-content">
        <Helmet title="P-Nomis" />
        <Header />
        <Modal />
        { this.props.router.location.pathname !== '/login' ?
          <nav className="nav-container">
            { this.props.router.location.pathname !== '/bookings/details' ?
              <Breadcrumbs route={this.props.router.location.pathname} /> :
              <BreadcrumbsAlt route={this.props.router.location.pathname} />
            }
          </nav>
            :
          null
        }
        <main className="container">
          <div className="main-content">
            {React.Children.toArray(this.props.children)}
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  setDeviceFormat: PropTypes.func,
  mobileMenuOpen: PropTypes.bool.isRequired,
  router: PropTypes.object.isRequired,
};

App.defaultProps = {
  children: [],
  setDeviceFormat: () => {},
  mobileMenuOpen: false,
};

const mapStateToProps = createStructuredSelector({
  mobileMenuOpen: selectMobileMenuOpen(),
});

const mapDispatchToProps = (dispatch) => ({
  setDeviceFormat: (format) => dispatch(setDeviceFormat(format)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
