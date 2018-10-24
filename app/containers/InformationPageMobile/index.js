import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { setModalData } from 'globalReducers/app'
import { selectModalOpen, selectModalData, selectDeviceFormat } from 'selectors/app'

import ModalMobileComponent from 'components/InformationPageMobile'

class InformationPageMobile extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { modalData } = this.props
    return <ModalMobileComponent modalData={modalData} />
  }
}

InformationPageMobile.propTypes = {
  modalData: PropTypes.object.isRequired,
}

InformationPageMobile.defaultProps = {}

const mapStateToProps = createStructuredSelector({
  modalOpen: selectModalOpen(),
  modalData: selectModalData(),
  deviceFormat: selectDeviceFormat(),
})

const mapDispatchToProps = {
  setModalData,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InformationPageMobile)
