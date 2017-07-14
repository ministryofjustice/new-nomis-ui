import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import Button, { ButtonRow } from 'components/Button';

import { SubmissionError, TextArea } from 'components/FormComponents';

const AmendCaseNoteForm = (props) => {
  const { handleSubmit, submitting, error, closeModal, isMobile, goBack } = props;
  return (
    <form onSubmit={handleSubmit}>
      <SubmissionError error={error}>{error}</SubmissionError>
      <Field name="caseNoteAmendmentText" component={TextArea} title="Case Note Amendment" type="text" autocomplete="off" spellcheck="true"/>
      <ButtonRow>
        <Button disabled={submitting} buttonstyle="cancel" onClick={isMobile ? goBack : closeModal}>Cancel</Button>
        <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="link" onClick={isMobile ? goBack : null}>Add Amendment</Button>
      </ButtonRow>
    </form>
  );
};

AmendCaseNoteForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  isMobile: PropTypes.bool,
  closeModal: PropTypes.func,
  goBack: PropTypes.func,
};

AmendCaseNoteForm.defaultProps = {
  error: '',
  isMobile: false,
  goBack: () => {}
};

export default reduxForm({
  form: 'amendCaseNote', // a unique identifier for this form,
  validate: (stuff) => {
    const { caseNoteAmendmentText } = stuff.toJS();
    const errors = {};
    if (!caseNoteAmendmentText) {
      errors.caseNoteAmendmentText = 'Required';
    }

    return errors;
  },
})(AmendCaseNoteForm);
