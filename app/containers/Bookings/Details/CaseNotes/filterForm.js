import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux'
import Button from '@govuk-react/button'
import { reduxForm, Field, formValueSelector, reset } from 'redux-form/immutable'
import { createFormAction } from 'redux-form-saga'
import { createStructuredSelector } from 'reselect'
import { DatePicker } from '../../../../components/FormComponents/DatePicker'
import { selectLocale } from '../../../LanguageProvider/selectors'
import TypeAndSubTypeSelector from '../../../../components/Bookings/TypeAndSubTypeSelector'
import { DATE_ONLY_FORMAT_SPEC } from '../../../App/constants'
import './filterForm.scss'
import { CASE_NOTE_FILTER } from '../../constants'
import { caseNoteFilterSelectInfo } from './selectors'
import { getQueryParams } from '../../../../helpers'
import { typeSelectorType } from '../../../../types'

const selector = formValueSelector('caseNoteFilter')

const FORM_NAME = 'caseNoteFilter'

const FilterForm = ({
  handleSubmit,
  submitting,
  error,
  caseNoteFilters,
  locale,
  typeValue,
  subTypeValue,
  resetFields,
}) => {
  const { type, subType } = caseNoteFilters
  const dateRangeNotValid = error.dateRangeValid === false

  return (
    <form className="filter-form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-sm-12 col-md-6 no-left-gutter">
          <h3 className="bold-medium no-left-gutter">Filters</h3>
        </div>
        <div className="col-sm-12 col-md-6 no-left-gutter">
          <span className="form-label date-range-label hidden-md-down">Occurrence date</span>
        </div>
      </div>

      <div className="row add-gutter-margin-top no-left-gutter">
        <div className="col-sm-12 col-md-6 stack-type-subtype no-left-gutter no-right-gutter">
          <TypeAndSubTypeSelector
            selectedType={typeValue}
            selectedSubType={subTypeValue}
            types={type}
            subTypes={subType}
          />
        </div>

        <div className="col-sm-12 col-md-4 no-left-gutter no-right-gutter">
          {dateRangeNotValid && <div className="error-message">Start date must be equal to or before the end date</div>}

          <span className="form-label date-range-label hidden add-gutter-margin-bottom add-gutter-margin-top">
            Occurrence date
          </span>

          <div className="stack-dates">
            <Field
              name="startDate"
              showError={dateRangeNotValid}
              component={DatePicker}
              locale={locale}
              title="From"
              shouldShowDay={date => date && date.isBefore(moment())}
            />

            <Field
              name="endDate"
              showError={dateRangeNotValid}
              component={DatePicker}
              locale={locale}
              title="To"
              shouldShowDay={date => date && date.isBefore(moment())}
            />
          </div>
        </div>

        <div className="col-sm-4 col-md-2 no-left-gutter no-right-gutter">
          <Button
            type="submit"
            disabled={dateRangeNotValid || submitting || error}
            margin={{ size: 5, direction: 'top' }}
          >
            Apply filters
          </Button>
        </div>
      </div>
      <div className="row">
        <button type="button" className="reset-filters-button link clickable" onClick={resetFields}>
          Clear filters
        </button>
      </div>
    </form>
  )
}

FilterForm.propTypes = {
  locale: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.shape({ dateRangeValid: PropTypes.bool }),
  caseNoteFilters: PropTypes.shape({
    types: typeSelectorType,
    subTypes: typeSelectorType,
  }).isRequired,
  resetFields: PropTypes.func.isRequired,

  typeValue: PropTypes.string,
  subTypeValue: PropTypes.string,
}

FilterForm.defaultProps = {
  locale: 'en',
  error: '',
  typeValue: '',
  subTypeValue: '',
}

export const validate = form => {
  let errors = {}
  const startDate = form.get('startDate')
  const endDate = form.get('endDate')

  if (
    endDate &&
    startDate &&
    moment(endDate, DATE_ONLY_FORMAT_SPEC).isBefore(moment(startDate, DATE_ONLY_FORMAT_SPEC), 'day')
  ) {
    errors = {
      ...errors,
      _error: {
        dateRangeValid: false,
      },
    }
  }

  return errors
}

const mapDispatchToProps = (dispatch, props) => ({
  resetFields: () => {
    dispatch(reset(FORM_NAME))
    dispatch({
      type: CASE_NOTE_FILTER.BASE,
      payload: {
        offenderNo: props.offenderNo,
        query: {
          perPage: 20,
          pageNumber: 0,
        },
      },
    })
  },
  validate,
  enableReinitialize: true,
  onSubmit: createFormAction(
    formData => {
      const startDate = formData.get('startDate')
      const endDate = formData.get('endDate')

      return {
        type: CASE_NOTE_FILTER.BASE,
        payload: {
          offenderNo: props.offenderNo,
          query: {
            perPage: 20,
            pageNumber: 0,
            startDate,
            endDate,
            type: formData.get('typeValue'),
            subType: formData.get('subTypeValue'),
          },
        },
      }
    },
    [CASE_NOTE_FILTER.SUCCESS, CASE_NOTE_FILTER.ERROR]
  ),
})

const mapStateToProps = createStructuredSelector({
  initialValues: (state, props) => {
    const { type, subType, startDate, endDate } = getQueryParams(props.location.search)

    return {
      typeValue: type,
      subTypeValue: subType,
      startDate,
      endDate,
    }
  },
  caseNoteFilters: caseNoteFilterSelectInfo(),
  typeValue: (state, props) => selector(state, 'typeValue') || getQueryParams(props.location.search).type,
  subTypeValue: (state, props) => selector(state, 'subTypeValue') || getQueryParams(props.location.search).subType,
  dateRangeValid: state => state.getIn(['search', 'details', 'caseNotes', 'dateRangeValid']),
  locale: selectLocale(),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: FORM_NAME,
  })(FilterForm)
)
