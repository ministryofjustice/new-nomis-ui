import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';

import { SubmissionError, TextArea } from 'components/FormComponents';

import { AMEND_CASENOTE } from '../../../constants';
import { DETAILS_TABS } from '../../../constants';
import { selectBookingDetailsId } from '../../../selectors';
import { viewDetails } from '../../../actions';

import './index.scss';

class AmendCaseNote extends Component {

  render() {
    const { handleSubmit, error, submitting, goBackToBookingDetails, offenderNo, caseNoteId } = this.props;

    if (this.props && this.props.error) {
      window.scrollTo(0,0);
    }

    return (<div className="amend-case-note add-gutter-margin-top">

      <form onSubmit={handleSubmit}>

        <div className="row">
          <div className="col-md-4 no-left-gutter">
            <h1 className="heading-large no-top-gutter">
              Amend case note
            </h1>

            {error && <div className="error-summary">
              <div className="error-message">
                {error}
              </div>
            </div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-8 no-left-gutter">
            <Field name="amendmentText" component={TextArea} title="Case note amendment" autocomplete="off" spellcheck="true" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 no-left-gutter">
            <button className="button add-gutter-margin-right" type="submit" disabled={error || submitting}> Save amendment </button>
            <button
              className="button button-cancel" onClick={(e) => {
                e.preventDefault();
                goBackToBookingDetails(offenderNo);
              }}
            > Cancel </button>
          </div>
        </div>
      </form>
    </div>)
  }
}

export function mapDispatchToProps(dispatch, props) {
  return {
    goBackToBookingDetails: (offenderNo) => dispatch(viewDetails(offenderNo, DETAILS_TABS.CASE_NOTES)),
    onSubmit: createFormAction((formData) => (
      {
        type: AMEND_CASENOTE.BASE,
        payload: {
          ...formData.toJS(),
          offenderNo: props.params.offenderNo,
          caseNoteId: props.params.caseNoteId,
        },
      }),
      [AMEND_CASENOTE.SUCCESS, AMEND_CASENOTE.ERROR]),
  };
}

const mapStateToProps = (state, props) => ({
  offenderNo: props.params.offenderNo,
  caseNoteId: props.params.caseNoteId,
})

export const validate = (form) => {
  if (!form) return {};

  const { amendmentText } = form.toJS();
  const error = {};

  if (!amendmentText) {
    error.amendmentText = 'Required';
  }

  if (amendmentText && amendmentText.length > 4000) {
    error.amendmentText = 'Maximum length should not exceed 4000 characters';
  }

  return error;
};

const asForm = reduxForm({
  form: 'amendCaseNote',
  validate,
  initialValues: Map({
  }),
})(AmendCaseNote);

export default connect(mapStateToProps, mapDispatchToProps)(asForm);
