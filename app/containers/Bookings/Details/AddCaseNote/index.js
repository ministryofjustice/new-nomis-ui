import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, formValueSelector } from 'redux-form/immutable';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { selectLocale } from 'containers/LanguageProvider/selectors';
import { SubmissionError, TextArea } from 'components/FormComponents';
import DateTimePicker from 'components/FormComponents/DateTimePicker';
import TypeAndSubTypeSelector from 'components/Bookings/TypeAndSubTypeSelector';
import moment from 'moment';

import { selectUsersTypesAndSubTypes } from 'containers/EliteApiLoader/selectors';
import { DETAILS_TABS, ADD_NEW_CASENOTE } from '../../constants';
import { selectBookingDetailsId } from '../../selectors';
import { viewDetails } from '../../actions';

import './index.scss';

const selector = formValueSelector('addCaseNote');

const AddCaseNoteForm = ({
      handleSubmit,
      submitting,
      error,
      caseNoteTypes,
      locale,
      typeValue,
      bookingDetailsId,
      goBackToBookingDetails }) =>

  <div className="add-case-note">
    <h1 className="bold-large">Add new case note</h1>
    <form onSubmit={handleSubmit}>
      <SubmissionError error={error}>{error}</SubmissionError>

      <TypeAndSubTypeSelector selectedType={typeValue} types={caseNoteTypes.types} subTypes={caseNoteTypes.subTypes} />

      <Field name="caseNoteText" component={TextArea} title="Case note" autocomplete="off" spellcheck="true" />

      <div className="occurrence-date-time">
        <Field
          name="occurrenceDateTime"
          component={DateTimePicker}
          editable
          locale={locale}
          title="Occurrence date and time:"
          shouldShowDay={(date) => date.isBefore(moment())}
        />
      </div>

      <div className="actions">

        <button className="button col-xs-12 col-sm-4" type="submit" disabled={submitting}>
          Save case note
        </button>

        <button className="cancel-button col-xs-12 col-sm-2" type="reset" onClick={() => goBackToBookingDetails(bookingDetailsId)}>
          Cancel
        </button>

      </div>
    </form>
  </div>

AddCaseNoteForm.propTypes = {
  caseNoteTypes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  locale: PropTypes.string,
};

AddCaseNoteForm.defaultProps = {
  locale: 'en',
  error: '',
};

export function mapDispatchToProps(dispatch) {
  return {
    goBackToBookingDetails: (bookingId) => dispatch(viewDetails(bookingId, DETAILS_TABS.CASE_NOTES)),
    onSubmit: createFormAction((formData) => (
      {
        type: ADD_NEW_CASENOTE.BASE,
        payload: {
          query: {
            ...formData.toJS(),
            typeAndSubType: {
              type: formData.toJS().typeValue,
              subType: formData.toJS().subTypeValue,
            } },
        },
      }),
      [ADD_NEW_CASENOTE.SUCCESS, ADD_NEW_CASENOTE.ERROR]),
  };
}

const mapStateToProps = createStructuredSelector({
  caseNoteTypes: selectUsersTypesAndSubTypes(),
  locale: selectLocale(),
  typeValue: (state) => selector(state, 'typeValue'),
  bookingDetailsId: selectBookingDetailsId(),
});

const validate = (stuff) => {
  if (!stuff) return {};
  const { caseNoteText, occurrenceDateTime, subTypeValue, typeValue } = stuff.toJS();
  const errors = {};

  if (!!caseNoteText && caseNoteText.length > 4000) {
    errors.caseNoteText = 'Maximum length should not exceed 4000 characters';
  }

  if (!typeValue) {
    errors.typeValue = 'Required';
  }

  if (!subTypeValue) {
    errors.subTypeValue = 'Required';
  }

  if (!caseNoteText) {
    errors.caseNoteText = 'Required';
  }

  if (!occurrenceDateTime) {
    errors.occurrenceDateTime = 'Required';
  }

  return errors;
};

const asForm = reduxForm({
  form: 'addCaseNote',
  validate,
  initialValues: Map({
    typeAndSubType: Map({ typeValue: '', subTypeValue: '', text: '' }),
  }),
})(AddCaseNoteForm);

export default connect(mapStateToProps, mapDispatchToProps)(asForm);
