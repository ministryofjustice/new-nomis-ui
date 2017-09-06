import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import { SubmissionError, TextArea } from 'components/FormComponents';
import './index.scss';

const AmendCaseNoteForm = (props) => {
  const { handleSubmit, submitting, error, closeModal, isMobile, goBack } = props;

  return (
    <form onSubmit={handleSubmit}>
      <SubmissionError error={error}>{error}</SubmissionError>
      <Field name="caseNoteAmendmentText" component={TextArea} title="Case note amendment" type="text" autocomplete="off" spellcheck="true" />
      <div className="actions">
        <button className="button col-xs-4" type="submit" disabled={submitting} submitting={submitting} onClick={isMobile ? goBack : null}>
          Save amendment
        </button>
        <button className="cancel-button col-xs-2" type="reset" disabled={submitting} onClick={isMobile ? goBack : closeModal}>
          Cancel
        </button>
      </div>
      {/* <ButtonRow> */}
      {/* <Button disabled={submitting} buttonstyle="cancel" onClick={isMobile ? goBack : closeModal}>Cancel</Button> */}
      {/* <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="link" onClick={isMobile ? goBack : null}>Add Amendment</Button> */}
      {/* </ButtonRow> */}
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
  goBack: () => {},
  closeModal: () => {},
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
