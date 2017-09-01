import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, formValueSelector} from 'redux-form/immutable';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { selectLocale } from 'containers/LanguageProvider/selectors';
import { SubmissionError, TextArea } from 'components/FormComponents';
import { ADD_NEW_CASENOTE } from '../../constants';
import { selectCaseNoteTypeList, selectCaseNoteSubTypeList } from './selectors';
import DateTimePicker from 'components/FormComponents/DateTimePicker';
import TypeAndSubTypeSelector from 'components/Bookings/TypeAndSubTypeSelector';
import moment from 'moment';
import './index.scss';

const selector = formValueSelector('addCaseNote');

class AddCaseNoteForm extends Component{

  constructor(props){
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.context.router.goBack();
  }

  render() {
    const {handleSubmit, submitting, error, caseNoteTypeList, caseNoteSubTypeList, locale, typeValue} = this.props;

    return (
      <div className="add-case-note">
        <h1 className="bold-large">Add new case note</h1>
        <form onSubmit={handleSubmit}>
          <SubmissionError error={error}>{error}</SubmissionError>

          <TypeAndSubTypeSelector selectedType={typeValue} types={caseNoteTypeList} subTypes={caseNoteSubTypeList}/>

          <Field name="caseNoteText" component={TextArea} title="Case Note" autocomplete="off" spellcheck="true"/>

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

            <button className="button col-xs-3" type="submit" disabled={submitting} submitting={submitting}>
              Save case note
            </button>

             <button className="cancel-button col-xs-2" onClick={this.goBack}>
              Cancel
            </button>

          </div>
        </form>
      </div>
    );
  }
};

AddCaseNoteForm.propTypes = {
  caseNoteTypeList: PropTypes.array.isRequired,
  caseNoteSubTypeList: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  isMobile: PropTypes.bool,
  locale: PropTypes.string,
};


AddCaseNoteForm.contextTypes = {
  router: PropTypes.object.isRequired,
};

AddCaseNoteForm.defaultProps = {
  locale: 'en',
  error: '',
  isMobile: false,
};

export function mapDispatchToProps() {
  return {
    onSubmit: createFormAction((formData) => (
      {
        type: ADD_NEW_CASENOTE.BASE,
        payload: {
          query: {...formData.toJS(),
            typeAndSubType:{
              type: formData.toJS().typeValue,
              subType: formData.toJS().subTypeValue
            }}
        }
      }),
      [ADD_NEW_CASENOTE.SUCCESS, ADD_NEW_CASENOTE.ERROR]),
  };
}

const mapStateToProps = createStructuredSelector({
  caseNoteTypeList: selectCaseNoteTypeList(),
  caseNoteSubTypeList: selectCaseNoteSubTypeList(),
  locale: selectLocale(),
  typeValue: state => selector(state,'typeValue')
});

const validate = (stuff) => {
  if (!stuff) return {};
  const { caseNoteText, occurrenceDateTime, subTypeValue,typeValue } = stuff.toJS();
  const errors = {};

  if ( ! typeValue){
    errors.typeValue = 'Required';
  }

  if( ! subTypeValue){
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
