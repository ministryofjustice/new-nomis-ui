import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MobileMenuComponent from 'components/MobileMenu';
import ModalData from 'containers/Footer/modal-data';

import { setMobileMenuOpen, setModalData } from 'globalReducers/app';
import { selectUser } from '../Authentication/selectors';

class MobileMenu extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    user: PropTypes.object.isRequired,
    setMobileMenuOpen: PropTypes.func.isRequired,
    setModalData: PropTypes.func.isRequired,
  }
  render() {
    const { user } = this.props;
    return (
      <MobileMenuComponent modalData={ModalData} setModalData={this.props.setModalData} user={user} setMobileMenuOpen={this.props.setMobileMenuOpen} />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
});

const mapDispatchToProps = {
  setMobileMenuOpen,
  setModalData,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu);
