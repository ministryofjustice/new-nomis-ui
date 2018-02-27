import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { reduxForm, Field, formValueSelector } from 'redux-form/immutable';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { selectLocale } from 'containers/LanguageProvider/selectors';
import { SubmissionError, TextArea } from 'components/FormComponents';

import DatePicker from 'components/FormComponents/DatePicker';
import TimePicker from 'components/FormComponents/TimePicker';
import { DATE_ONLY_FORMAT_SPEC, DATE_TIME_FORMAT_SPEC } from 'containers/App/constants';
import TypeAndSubTypeSelector from 'components/Bookings/TypeAndSubTypeSelector';
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
      goBackToBookingDetails,
      eventDate }) =>

  <div className="add-case-note">
    <h1 className="bold-large">Add new case note</h1>
    <form onSubmit={handleSubmit}>
      <SubmissionError error={error}>{error}</SubmissionError>

      <div className="row">
        <div className="col-sm-4 no-left-gutter">
          <TypeAndSubTypeSelector selectedType={typeValue} types={caseNoteTypes.types} subTypes={caseNoteTypes.subTypes} />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-8 no-left-gutter">
          <Field name="caseNoteText" component={TextArea} title="Case note" autocomplete="off" spellcheck="true" />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3 col-md-2 col-xs-6 no-left-gutter event-date">
          <Field
            name="eventDate"
            title="Select date"
            component={DatePicker}
            locale={locale}
            defaultValue={eventDate || moment()}
            shouldShowDay={(date) => date.isBefore(moment())}
          />
        </div>
        <div className="col-sm-3 col-md-2 col-xs-6 no-left-gutter">
          <Field
            name="startTime"
            title="Time"
            component={TimePicker}
            date={eventDate || moment()}
            now={moment()}
            pastTimeOnly
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 no-left-gutter">

          <button className="button add-gutter-margin-right add-gutter-margin-bottom" type="submit" disabled={submitting}>
            Save case note
          </button>

          <button
            className="button button-cancel" type="reset" onClick={(e) => {
              e.preventDefault();
              goBackToBookingDetails(bookingDetailsId);
            }}
          >
            Cancel
          </button>

        </div>
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
  eventDate: (state) => formValueSelector('addCaseNote')(state,'eventDate'),
});

export const validate = (stuff) => {
  if (!stuff) return {};
  const { caseNoteText, startTime, subTypeValue, typeValue } = stuff.toJS();
  const error = {};

  if (caseNoteText && caseNoteText.length > 4000) {
    error.caseNoteText = 'Maximum length should not exceed 4000 characters';
  }

  if (!typeValue) {
    error.typeValue = 'Required';
  }

  if (!subTypeValue) {
    error.subTypeValue = 'Required';
  }

  if (!caseNoteText) {
    error.caseNoteText = 'Required';
  }

  if (!startTime) {
    error.startTime = 'Please select a time';
  }

  return error;
};

const asForm = reduxForm({
  form: 'addCaseNote',
  validate,
  initialValues: Map({
    typeAndSubType: Map({ eventDate: moment(), typeValue: '', subTypeValue: '', text: '' }),
  }),
})(AddCaseNoteForm);

export default connect(mapStateToProps, mapDispatchToProps)(asForm);
