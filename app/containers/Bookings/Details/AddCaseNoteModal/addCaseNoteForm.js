import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Button, { ButtonRow } from 'components/Button';

import { SubmissionError, TextArea } from 'components/FormComponents';
import TypeSubTypeSelectors from 'containers/FormContainers/typeSubTypeSelectors';
import OccurrenceDateTimePicker from 'containers/FormContainers/occurrenceDateTimePicker';

import { ADD_NEW_CASENOTE } from '../../constants';
import { selectCaseNoteTypeList, selectCaseNoteSubTypeList } from './selectors';

const AddCaseNoteForm = (props) => {
  const { handleSubmit, submitting, error, caseNoteTypeList, caseNoteSubTypeList, closeModal, goBack, isMobile } = props;
  const options = { types: caseNoteTypeList, subTypes: caseNoteSubTypeList }; // options={options}
  return (
    <form onSubmit={handleSubmit}>
      <SubmissionError error={error}>{error}</SubmissionError>
      <Field name="typeAndSubType" component={TypeSubTypeSelectors} options={options} isMobile />
      <Field name="caseNoteText" component={TextArea} title="Case Note" autocomplete="off" spellcheck="true"/>
      <Field name="occurrenceDateTime" component={OccurrenceDateTimePicker} editable title="Occurrence Date" />
      <OccurrenceDateTimePicker title="Creation Date" />
      <ButtonRow style={{ marginTop: '40px' }}>
        <Button disabled={submitting} buttonstyle="cancel" onClick={isMobile ? goBack : closeModal}>Cancel</Button>
        <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="link">Submit</Button>
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
  closeModal: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  goBack: PropTypes.func,
};

AddCaseNoteForm.defaultProps = {
  error: '',
  isMobile: false,
  goBack: () => { },
};

export function mapDispatchToProps() {
  return {
    onSubmit: createFormAction((formData) => ({ type: ADD_NEW_CASENOTE.BASE, payload: { query: formData.toJS() } }), [ADD_NEW_CASENOTE.SUCCESS, ADD_NEW_CASENOTE.ERROR]),
  };
}

const mapStateToProps = createStructuredSelector({
  caseNoteTypeList: selectCaseNoteTypeList(),
  caseNoteSubTypeList: selectCaseNoteSubTypeList(),
});

const validate = (stuff) => {
  if (!stuff) return {};
  const { caseNoteText, typeAndSubType, occurrenceDateTime } = stuff.toJS();
  const { type, subType } = typeAndSubType;
  const tSt = {};
  if (!type) {
    tSt.type = 'Required';
  }
  if (!subType) {
    tSt.subType = 'Required';
  }
  const errors = {};
  if (!type || !subType) {
    errors.typeAndSubType = tSt;
  }
  if (!caseNoteText) {
    errors.caseNoteText = 'Required';
  }

  if (occurrenceDateTime === 'error') {
    errors.occurrenceDateTime = true;
  }

  return errors;
};

const asForm = reduxForm({
  form: 'addCaseNote', // a unique identifier for this form
  validate,
  initialValues: Map({
    typeAndSubType: Map({ type: '', subType: '' }),
  }),
})(AddCaseNoteForm);

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(asForm);
