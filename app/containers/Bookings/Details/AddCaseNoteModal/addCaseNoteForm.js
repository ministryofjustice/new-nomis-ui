import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues, Field } from 'redux-form/immutable';
import Button, { ButtonRow } from 'components/Button';
import { createStructuredSelector } from 'reselect';

import { Select, SubmissionError, TextArea } from 'components/FormComponents';
import { selectCaseNoteTypeList } from './selectors';

const AddCaseNoteForm = (props) => {
  const { handleSubmit, submitting, error, caseNoteTypeList, formVals, caseNoteSubTypeList } = props;
  // const subTypes = [{ value: 'Select a Type' }];
  // if (formVals) {
  //   const caseNoteType = formVals.get('caseNoteType');
  //   subTypes = Object.values(caseNoteTypeList.filter((c) => c.value === caseNoteType)[0].subTypes.toJS());
  // }

  return (
    <form onSubmit={handleSubmit}>
      <SubmissionError error={error}>{error}</SubmissionError>
      <div>
        <Field name="caseNoteType" component={Select} options={caseNoteTypeList} title="Select Case Note Type" subTitle="Select Case Note SubType" />
      </div>
      <div>
        <Field name="caseNoteSubType" component={Select} options={caseNoteSubTypeList} title="Select Case Note SubType" />
      </div>
      <div>
        <Field name="caseNoteText" component={TextArea} type="number" title="Case Note" autocomplete="off" />
      </div>
      <ButtonRow>
        <Button disabled={submitting} buttonstyle="cancel">Cancel</Button>
        <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="link">Search</Button>
      </ButtonRow>
    </form>
  );
};

AddCaseNoteForm.propTypes = {
  caseNoteTypeList: PropTypes.array.isRequired,
  caseNoteSubTypeList: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

AddCaseNoteForm.defaultProps = {
  error: '',
};

const mapStateToProps = createStructuredSelector({
  formVals: (state) => getFormValues('addCaseNote')(state),
  // activeTabId: selectCurrentDetailTabId(),
});

export default connect(mapStateToProps)(reduxForm({
  form: 'addCaseNote', // a unique identifier for this form
})(AddCaseNoteForm));
