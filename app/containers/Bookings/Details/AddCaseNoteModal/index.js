import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

import { connect } from 'react-redux';
import ModalWrapper from 'components/ModalForm';
import { FormTitle } from 'components/Bookings/Details/CaseNoteForms';

import { closeAddCaseNoteModal } from '../../actions';
import AddCaseNoteForm from './addCaseNoteForm';

class AddCaseNoteModal extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (<ModalWrapper closeModal={() => { this.props.closeCaseNoteModal(); }} >
      <FormTitle>Add New Case Note</FormTitle>
      <AddCaseNoteForm closeModal={this.props.closeCaseNoteModal} onSubmit={this.props.onSubmitForm} />
    </ModalWrapper>);
  }
}

AddCaseNoteModal.propTypes = {
  closeCaseNoteModal: PropTypes.func.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    closeCaseNoteModal: () => dispatch(closeAddCaseNoteModal()),
  };
}

const mapStateToProps = createStructuredSelector({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(AddCaseNoteModal);
