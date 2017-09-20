import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MobileMenuComponent from 'components/MobileMenu';
import ModalData from 'containers/Footer/modal-data';

import { setMobileMenuOpen, setModalData } from 'globalReducers/app';
import { selectUserHeaderInfo } from '../Header/selectors';
import { switchCaseLoad } from '../EliteApiLoader/actions';

class MobileMenu extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { user, switchCaseLoad: sL } = this.props;

    if (!user) {
      return <div></div>
    }

    return (
      <MobileMenuComponent
        switchCaseLoad={sL}
        modalData={ModalData}
        setModalData={this.props.setModalData}
        user={user}
        setMobileMenuOpen={this.props.setMobileMenuOpen}
      />
    );
  }
}

MobileMenu.propTypes = {
  setMobileMenuOpen: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
  switchCaseLoad: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  user: selectUserHeaderInfo(),
});

const mapDispatchToProps = {
  setMobileMenuOpen,
  setModalData,
  switchCaseLoad,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu);
