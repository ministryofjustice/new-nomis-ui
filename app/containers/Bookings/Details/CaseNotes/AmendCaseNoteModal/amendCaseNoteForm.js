import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import Button, { ButtonRow } from 'components/Button';

import { SubmissionError, TextArea } from 'components/FormComponents';

const AddCaseNoteForm = (props) => {
  const { handleSubmit, submitting, error, closeModal } = props;
  return (
    <form onSubmit={handleSubmit}>
      <SubmissionError error={error}>{error}</SubmissionError>
      <div>
        <Field name="caseNoteAmendmentText" component={TextArea} title="Case Note Amendment" type="text" autocomplete="off" />
      </div>
      <ButtonRow>
        <Button disabled={submitting} buttonstyle="cancel" onClick={closeModal}>Cancel</Button>
        <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="link">Add Amendment</Button>
      </ButtonRow>
    </form>
  );
};

AddCaseNoteForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
};

AddCaseNoteForm.defaultProps = {
  error: '',
};

export default reduxForm({
  form: 'addCaseNote', // a unique identifier for this form
})(AddCaseNoteForm);
