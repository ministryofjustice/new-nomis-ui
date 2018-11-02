import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import MobileMenuComponent from '../../components/MobileMenu'
import ModalData from '../Footer/modal-data'

import { setMenuOpen, setModalData } from '../../globalReducers/app'
import selectUserHeaderInfo from '../Header/selectors'
import { switchCaseLoad } from '../EliteApiLoader/actions'

const MobileMenu = ({
  user,
  switchCaseLoad: switchLoad,
  setModalData: modelData,
  setMenuOpen: menuOpen,
  showTerms: terms,
}) => {
  if (!user) {
    return <div />
  }

  return (
    <MobileMenuComponent
      switchCaseLoad={switchLoad}
      modalData={ModalData}
      setModalData={modelData}
      user={user}
      setMenuOpen={menuOpen}
      showTerms={terms}
    />
  )
}

MobileMenu.propTypes = {
  user: PropTypes.shape({}),
  showTerms: PropTypes.func.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
  switchCaseLoad: PropTypes.func.isRequired,
}

MobileMenu.defaultProps = {
  user: undefined,
}

const mapStateToProps = createStructuredSelector({
  user: selectUserHeaderInfo(),
})

const mapDispatchToProps = {
  setMenuOpen,
  setModalData,
  switchCaseLoad,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileMenu)
