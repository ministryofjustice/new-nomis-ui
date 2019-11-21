import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import { createFormAction } from 'redux-form-saga'
import { Map } from 'immutable'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Button from '@govuk-react/button'

import SessionHeartbeatHandler from '../../../../../utils/sessionHeartbeatHandler'
import { TextArea, ButtonCancel } from '../../../../../components/FormComponents'
import { AMEND_CASENOTE } from '../../../constants'
import { extendActiveSession } from '../../../actions'
import Page from '../../../../../components/Page'
import { ButtonContainer } from './AmendCaseNote.styles'

const AmendCaseNote = ({ handleSubmit, error, submitting, extendSession, location }) => {
  if (error) {
    window.scrollTo(0, 0)
  }

  const sessionHandler = new SessionHeartbeatHandler(extendSession)

  return (
    <Page title="Amend case note">
      <div className="amend-case-note">
        <form onSubmit={handleSubmit}>
          <GridRow>
            <GridCol setWidth="two-thirds">
              {error && (
                <div className="error-summary">
                  <div className="error-message">{error}</div>
                </div>
              )}
              <Field
                name="amendmentText"
                component={TextArea}
                title="Case note amendment"
                autocomplete="off"
                spellcheck="true"
                onChange={() => sessionHandler.onUpdate()}
              />
              <ButtonContainer>
                <Button type="submit" disabled={error || submitting}>
                  Save amendment
                </Button>
                <ButtonCancel as={Link} to={location.state.from}>
                  Cancel
                </ButtonCancel>
              </ButtonContainer>
            </GridCol>
          </GridRow>
        </form>
      </div>
    </Page>
  )
}

AmendCaseNote.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  location: ReactRouterPropTypes.location.isRequired,

  // mapDispatchToProps
  extendSession: PropTypes.func.isRequired,
}

AmendCaseNote.defaultProps = {
  error: '',
}

const mapDispatchToProps = (dispatch, props) => ({
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
  } else if (amendmentText.length > 30000) {
    error.amendmentText = 'Maximum length should not exceed 30000 characters'
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
