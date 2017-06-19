import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import Button, { ButtonRow } from 'components/Button';

import { SubmissionError, TextArea } from 'components/FormComponents';

import { Wrapper, FieldWrapper } from './mobile.theme';

const AddCaseNoteFormMobile = (props) => {
  const { handleSubmit, submitting, error, goBack } = props;
  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <SubmissionError error={error}>{error}</SubmissionError>
        <FieldWrapper>
          <Field name="caseNoteAmendmentText" component={TextArea} title="Case Note Amendment" type="text" autocomplete="off" />
        </FieldWrapper>
        <ButtonRow>
          <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="link" onClick={goBack}>Add Amendment</Button>
        </ButtonRow>
      </form>
    </Wrapper>
  );
};

AddCaseNoteFormMobile.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  goBack: PropTypes.func.isRequired,
};

AddCaseNoteFormMobile.defaultProps = {
  error: '',
};

export default reduxForm({
  form: 'amendCaseNote', // a unique identifier for this form
})(AddCaseNoteFormMobile);
