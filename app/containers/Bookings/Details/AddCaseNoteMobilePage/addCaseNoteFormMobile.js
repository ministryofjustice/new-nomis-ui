import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import Button, { ButtonRow } from 'components/Button';

import { Select, SubmissionError, TextArea } from 'components/FormComponents';

import { FormWrapper, FieldWrapper } from './mobile.theme';

const AddCaseNoteFormMobile = (props) => {
  const { handleSubmit, submitting, error, caseNoteTypeList, caseNoteSubTypeList, goBack } = props;
  return (
    <FormWrapper onSubmit={handleSubmit}>
      <SubmissionError error={error}>{error}</SubmissionError>
      <FieldWrapper>
        <Field name="caseNoteType" component={Select} options={caseNoteTypeList} title="Select Case Note Type" subTitle="Select Case Note SubType" />
      </FieldWrapper>
      <FieldWrapper>
        <Field name="caseNoteSubType" component={Select} options={caseNoteSubTypeList} title="Select Case Note SubType" />
      </FieldWrapper>
      <FieldWrapper>
        <Field name="caseNoteText" component={TextArea} type="number" title="Case Note" autocomplete="off" />
      </FieldWrapper>
      <ButtonRow>
        <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="link" onClick={goBack}>Submit</Button>
      </ButtonRow>
    </FormWrapper>
  );
};

AddCaseNoteFormMobile.propTypes = {
  caseNoteTypeList: PropTypes.array.isRequired,
  caseNoteSubTypeList: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  goBack: PropTypes.func.isRequired,
};

AddCaseNoteFormMobile.defaultProps = {
  error: '',
};

export default reduxForm({
  form: 'addCaseNote', // a unique identifier for this form
})(AddCaseNoteFormMobile);
