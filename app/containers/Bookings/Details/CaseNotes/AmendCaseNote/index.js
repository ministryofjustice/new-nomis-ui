import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { createFormAction } from 'redux-form-saga'
import { Map } from 'immutable'
import SessionHeartbeatHandler from '../../../../../utils/sessionHeartbeatHandler'

import { TextArea } from '../../../../../components/FormComponents'

import { AMEND_CASENOTE, DETAILS_TABS } from '../../../constants'
import { extendActiveSession, viewDetails } from '../../../actions'

import './index.scss'
import Page from '../../../../../components/Page'

const AmendCaseNote = ({ handleSubmit, error, submitting, goBackToBookingDetails, offenderNo, extendSession }) => {
  if (error) {
    window.scrollTo(0, 0)
  }

  const sessionHandler = new SessionHeartbeatHandler(extendSession)

  return (
    <Page title="Amend case note">
      <div className="amend-case-note add-gutter-margin-top">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 no-left-gutter">
              {error && (
                <div className="error-summary">
                  <div className="error-message">{error}</div>
                </div>
              )}
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
              <button className="button add-gutter-margin-right" type="submit" disabled={error || submitting}>
                {' '}
                Save amendment{' '}
              </button>
              <button
                type="button"
                className="button button-cancel"
                onClick={e => {
                  e.preventDefault()
                  goBackToBookingDetails(offenderNo)
                }}
              >
                {' '}
                Cancel{' '}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Page>
  )
}

AmendCaseNote.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  offenderNo: PropTypes.string.isRequired,

  // mapDispatchToProps
  goBackToBookingDetails: PropTypes.func.isRequired,
  extendSession: PropTypes.func.isRequired,
}

AmendCaseNote.defaultProps = {
  error: '',
}

const mapDispatchToProps = (dispatch, props) => ({
  goBackToBookingDetails: offenderNo => dispatch(viewDetails(offenderNo, DETAILS_TABS.CASE_NOTES)),
  extendSession: () => dispatch(extendActiveSession()),
  onSubmit: createFormAction(
    formData => ({
      type: AMEND_CASENOTE.BASE,
      payload: {
        ...formData.toJS(),
        offenderNo: props.match.params.offenderNo,
        caseNoteId: props.match.params.caseNoteId,
        caseNoteListReferrer: props.location.state.from,
      },
    }),
    [AMEND_CASENOTE.SUCCESS, AMEND_CASENOTE.ERROR]
  ),
})

const mapStateToProps = (state, props) => ({
  offenderNo: props.match.params.offenderNo,
  caseNoteId: props.match.params.caseNoteId,
})

export const validate = form => {
  if (!form) return {}

  const { amendmentText } = form.toJS()
  const error = {}

  if (!amendmentText) {
    error.amendmentText = 'Required'
  }

  return error
}

const asForm = reduxForm({
  form: 'amendCaseNote',
  validate,
  initialValues: Map({}),
})(AmendCaseNote)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(asForm)
