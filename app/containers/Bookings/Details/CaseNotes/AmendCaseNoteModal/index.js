import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';

import { connect } from 'react-redux';
import ModalWrapper from 'components/ModalForm';

import { closeAmendCaseNoteModal } from 'containers/Bookings/actions';
import { AMEND_CASENOTE } from 'containers/Bookings/constants';
import AmendCaseNoteForm from './amendCaseNoteForm';

import './index.scss';

class AmendCaseNoteModal extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (<ModalWrapper closeModal={() => { this.props.closeAmendCaseNoteModal(); }} >
      <div className="amend-case-note">
        <h1 className="bold-large">Amend case note</h1>
        <AmendCaseNoteForm closeModal={this.props.closeAmendCaseNoteModal} initialValues={{ }} onSubmit={this.props.onSubmitForm} />
      </div>
    </ModalWrapper>);
  }
}

AmendCaseNoteModal.propTypes = {
  closeAmendCaseNoteModal: PropTypes.func.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    closeAmendCaseNoteModal: () => dispatch(closeAmendCaseNoteModal()),
    onSubmitForm: createFormAction((formData) => ({ type: AMEND_CASENOTE.BASE, payload: { query: formData.toJS() } }), [AMEND_CASENOTE.SUCCESS, AMEND_CASENOTE.ERROR]),
  };
}

const mapStateToProps = createStructuredSelector({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(AmendCaseNoteModal);
