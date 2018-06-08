import React from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import { connect } from 'react-redux';
import { createFormAction } from 'redux-form-saga';
import { Map } from 'immutable';
import SessionHeartbeatHandler from 'utils/sessionHeartbeatHandler';

import { TextArea } from 'components/FormComponents';

import { AMEND_CASENOTE } from '../../../constants';
import { DETAILS_TABS } from '../../../constants';
import { extendActiveSession, viewDetails } from '../../../actions';


import './index.scss';

const AmendCaseNote = (props) => {
  const { handleSubmit, error, submitting, goBackToBookingDetails, offenderNo, extendSession } = props;

  if (this.props && this.props.error) {
    window.scrollTo(0,0);
  }

  const sessionHandler = new SessionHeartbeatHandler(extendSession);


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
          <Field
            name="amendmentText"
            component={TextArea}
            title="Case note amendment"
            autocomplete="off"
            spellcheck="true"
            onChange={() => sessionHandler.onUpdate()}
          />
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
};

export function mapDispatchToProps(dispatch, props) {
  return {
    goBackToBookingDetails: (offenderNo) => dispatch(viewDetails(offenderNo, DETAILS_TABS.CASE_NOTES)),
    extendSession: () => dispatch(extendActiveSession()),
    onSubmit: createFormAction((formData) => (
      {
        type: AMEND_CASENOTE.BASE,
        payload: {
          ...formData.toJS(),
          offenderNo: props.params.offenderNo,
          caseNoteId: props.params.caseNoteId,
          itemId: props.params.caseNoteId,
        },
      }),
    [AMEND_CASENOTE.SUCCESS, AMEND_CASENOTE.ERROR]),
  };
}

const mapStateToProps = (state, props) => ({
  offenderNo: props.params.offenderNo,
  caseNoteId: props.params.caseNoteId,
});

export const validate = (form) => {
  if (!form) return {};

  const { amendmentText } = form.toJS();
  const error = {};

  if (!amendmentText) {
    error.amendmentText = 'Required';
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
