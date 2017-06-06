import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MobileMenuComponent from 'components/MobileMenu';

import { selectMobileMenuOpen } from 'selectors/app';

class MobileMenu extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  }

  render() {
    const { user, setMobileMenuOpen, mobileMenuOpen } = this.props;
    // return <MobileMenuComponent user={user} setMobileMenuOpen={setMobileMenuOpen} />;
    return mobileMenuOpen ? <MobileMenuComponent user={user} setMobileMenuOpen={setMobileMenuOpen} /> : null;
  }
}

MobileMenu.propTypes = {
  user: PropTypes.object,
  setMobileMenuOpen: PropTypes.func,
  mobileMenuOpen: PropTypes.bool,
};

MobileMenu.defaultProps = {
  user: undefined,
  setMobileMenuOpen: () => {},
  mobileMenuOpen: false,
};

const mapStateToProps = createStructuredSelector({
  mobileMenuOpen: selectMobileMenuOpen(),
});

// const mapDispatchToProps = {
// };

export default connect(mapStateToProps, null)(MobileMenu);
