import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MobileMenuComponent from 'components/MobileMenu';
import ModalData from 'containers/Footer/modal-data';

import { setMobileMenuOpen, setModalData } from 'globalReducers/app';
import { selectUserHeaderInfo } from '../Header/selectors';
import { switchCaseLoad } from '../EliteApiLoader/actions';

const MobileMenu = (props) => {
  const { 
    user, 
    switchCaseLoad: switchLoad, 
    setModalData: modelData,
    setMobileMenuOpen: mobileMenuOpen, 
    showTerms: terms,
  } = props;

  if (!user) {
    return <div></div>
  }

  return (
    <MobileMenuComponent
      switchCaseLoad={switchLoad}
      modalData={ModalData}
      setModalData={modelData}
      user={user}
      setMobileMenuOpen={mobileMenuOpen}
      showTerms={terms}
    />
  );
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
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu);
