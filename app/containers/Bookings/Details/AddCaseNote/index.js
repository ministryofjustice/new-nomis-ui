import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { reduxForm, Field, formValueSelector } from 'redux-form/immutable'
import { createStructuredSelector } from 'reselect'
import { createFormAction } from 'redux-form-saga'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { selectLocale } from '../../../LanguageProvider/selectors'
import { SubmissionError, TextArea } from '../../../../components/FormComponents'

import {
  DatePicker,
  momentToLocalizedDate,
  localizedDateToMoment,
} from '../../../../components/FormComponents/DatePicker'
import TimePicker from '../../../../components/FormComponents/TimePicker'

import TypeAndSubTypeSelector, { typeSelectorType } from '../../../../components/Bookings/TypeAndSubTypeSelector'
import { selectUsersTypesAndSubTypes } from '../../../EliteApiLoader/selectors'
import { Model as offenderDetailsModel } from '../../../../helpers/dataMappers/offenderDetails'
import SessionHeartbeatHandler from '../../../../utils/sessionHeartbeatHandler'
import { FormattedDate, FormattedTime } from '../../../../components/intl'

import { DETAILS_TABS, ADD_NEW_CASENOTE } from '../../constants'
import { viewDetails, extendActiveSession, loadCaseNoteTypesAndSubTypes } from '../../actions'
import { getQueryParams } from '../../../../helpers'
import { toFullName } from '../../../../utils/stringUtils'
import './index.scss'
import Page from '../../../../components/Page'

const selector = formValueSelector('addCaseNote')

class AddCaseNoteForm extends Component {
  constructor() {
    super()
    this.state = {
      editDateTime: false,
    }
  }

  componentDidMount() {
    const { loadCaseNoteTypes, boundViewDetails } = this.props

    boundViewDetails()
    loadCaseNoteTypes()
  }

  render() {
    const {
      handleSubmit,
      submitting,
      error,
      caseNoteTypes,
      locale,
      typeValue,
      match: {
        params: { offenderNo },
      },
      goBackToBookingDetails,
      eventDate,
      extendSession,
      offenderDetails,
    } = this.props

    const sessionHandler = new SessionHeartbeatHandler(extendSession)
    const today = moment()
    const { editDateTime } = this.state
    const offenderName = toFullName({
      firstName: offenderDetails.get('firstName'),
      lastName: offenderDetails.get('lastName'),
    })

    return (
      <Page title="Add new case note">
        <div className="add-case-note">
          <form onSubmit={handleSubmit}>
            <SubmissionError error={error}>{error}</SubmissionError>

            <div className="row">
              <div className="col-md-2 no-left-gutter">
                <span>Name</span>
              </div>
            </div>

            <div className="row add-gutter-margin-bottom">
              <div className="col-md-4 no-left-gutter">
                <strong>
                  {offenderName} ({offenderNo})
                </strong>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4 no-left-gutter">
                <TypeAndSubTypeSelector
                  selectedType={typeValue}
                  types={caseNoteTypes.types}
                  subTypes={caseNoteTypes.subTypes}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-8 no-left-gutter">
                <Field
                  name="caseNoteText"
                  component={TextArea}
                  title="Case note"
                  autocomplete="off"
                  spellcheck="true"
                  onChange={() => sessionHandler.onUpdate()}
                />
              </div>
            </div>

            <div className="row">
              <strong> Occurrence date and time </strong>
            </div>

            {!editDateTime && (
              <div className="row">
                <div className="col-sm-3 col-md-3 col-xs-6 no-left-gutter add-gutter-bottom">
                  <span>
                    <FormattedDate value={today.format()} />
                  </span>
                  <span>&nbsp;-&nbsp;</span>
                  <span>
                    <FormattedTime value={today.format()} />
                  </span>
                  <span>
                    <button
                      type="button"
                      name="change-date-time"
                      className="link"
                      onClick={() =>
                        this.setState({
                          editDateTime: !this.editDateTime,
                        })
                      }
                    >
                      Change
                    </button>
                  </span>
                </div>
              </div>
            )}

            {editDateTime && (
              <div className="row">
                <div className="col-sm-3 col-md-2 col-xs-6 no-left-gutter event-date">
                  <Field
                    name="eventDate"
                    title="Select date"
                    component={DatePicker}
                    locale={locale}
                    format={momentToLocalizedDate(locale)}
                    parse={localizedDateToMoment(locale)}
                    defaultValue={eventDate || today}
                    shouldShowDay={date => date.isBefore(moment())}
                  />
                </div>
                <div className="col-sm-3 col-md-2 col-xs-6 no-left-gutter">
                  <Field
                    name="startTime"
                    title="Time"
                    component={TimePicker}
                    date={eventDate || today}
                    now={today}
                    pastTimeOnly
                    initialiseToNow
                  />
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-md-3 no-left-gutter">
                <button
                  className="button add-gutter-margin-right add-gutter-margin-bottom"
                  type="submit"
                  disabled={submitting}
                >
                  Save case note
                </button>

                <button
                  className="button button-cancel"
                  type="button"
                  onClick={e => {
                    e.preventDefault()
                    goBackToBookingDetails()
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </Page>
    )
  }
}

AddCaseNoteForm.propTypes = {
  caseNoteTypes: PropTypes.shape({
    types: typeSelectorType.isRequired,
    subTypes: typeSelectorType.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  locale: PropTypes.string,
  typeValue: PropTypes.string,
  eventDate: PropTypes.string,
  match: PropTypes.shape({ params: PropTypes.shape({ offenderNo: PropTypes.string.isRequired }) }).isRequired,
  goBackToBookingDetails: PropTypes.func.isRequired,
  loadCaseNoteTypes: PropTypes.func.isRequired,
  extendSession: PropTypes.func.isRequired,
  offenderDetails: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  boundViewDetails: PropTypes.func.isRequired,
}

AddCaseNoteForm.defaultProps = {
  locale: 'en',
  error: '',
  typeValue: '',
  eventDate: '',
}

const mapDispatchToProps = (dispatch, props) => {
  const { type, subType } = getQueryParams(props.location.search)
  const {
    match: {
      params: { offenderNo },
    },
  } = props

  return {
    initialValues: Map({
      typeValue: type,
      subTypeValue: subType,
      typeAndSubType: Map({ typeValue: '', subTypeValue: '', text: '' }),
    }),
    boundViewDetails: () => dispatch(viewDetails(offenderNo, DETAILS_TABS.ADD_CASE_NOTE)),
    goBackToBookingDetails: () => dispatch(viewDetails(offenderNo, DETAILS_TABS.CASE_NOTES)),
    loadCaseNoteTypes: () => dispatch(loadCaseNoteTypesAndSubTypes()),
    extendSession: () => dispatch(extendActiveSession()),
    onSubmit: createFormAction(
      formData => ({
        type: ADD_NEW_CASENOTE.BASE,
        payload: {
          offenderNo,
          query: {
            ...formData.toJS(),
            typeAndSubType: {
              type: formData.toJS().typeValue,
              subType: formData.toJS().subTypeValue,
            },
          },
        },
      }),
      [ADD_NEW_CASENOTE.SUCCESS, ADD_NEW_CASENOTE.ERROR]
    ),
  }
}

const mapStateToProps = createStructuredSelector({
  caseNoteTypes: selectUsersTypesAndSubTypes(),
  locale: selectLocale(),
  typeValue: state => selector(state, 'typeValue'),
  eventDate: state => formValueSelector('addCaseNote')(state, 'eventDate'),
  offenderDetails: (state, props) =>
    state.getIn(['eliteApiLoader', 'Bookings', 'Details', props.match.params.offenderNo, 'Data']) ||
    offenderDetailsModel,
})

export const validate = stuff => {
  if (!stuff) return {}
  const { caseNoteText, startTime, subTypeValue, typeValue } = stuff.toJS()
  const error = {}

  if (caseNoteText && caseNoteText.length > 4000) {
    error.caseNoteText = 'Maximum length should not exceed 4000 characters'
  }

  if (!typeValue) {
    error.typeValue = 'Required'
  }

  if (!subTypeValue) {
    error.subTypeValue = 'Required'
  }

  if (!caseNoteText) {
    error.caseNoteText = 'Required'
  }

  if (!startTime) {
    error.startTime = 'Please select a time'
  }

  return error
}

const asForm = reduxForm({
  form: 'addCaseNote',
  validate,
})(AddCaseNoteForm)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(asForm)
