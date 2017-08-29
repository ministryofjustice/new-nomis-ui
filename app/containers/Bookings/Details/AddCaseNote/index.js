import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { selectLocale } from 'containers/LanguageProvider/selectors';
import { SubmissionError, TextArea } from 'components/FormComponents';
import OccurrenceDateTimePicker from 'containers/FormContainers/occurrenceDateTimePicker';

import { ADD_NEW_CASENOTE } from '../../constants';
import { selectCaseNoteTypeList, selectCaseNoteSubTypeList } from './selectors';

class AddCaseNoteForm extends Component{

  constructor(props){
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.context.router.goBack();
  }

  render() {
    const {handleSubmit, submitting, error, caseNoteTypeList, caseNoteSubTypeList, locale} = this.props;
    const options = {types: caseNoteTypeList, subTypes: caseNoteSubTypeList};

    return (
      <div>
        <h1 className="bold-large">Add new case note</h1>
        <form onSubmit={handleSubmit}>
          <SubmissionError error={error}>{error}</SubmissionError>

          <div className="form-group">
            <label className="form-label">
              Type
            </label>
            <Field className="form-control" component="select" name="typeValue">
              <option> Select</option>
              {options.types.map(t =>
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              )}
            </Field>
          </div>

          <div className="form-group">
            <label className="form-label">
              Sub-type
            </label>

            <Field className="form-control" component="select" name="subTypeValue">
              <option> Select</option>
              {options.subTypes.map(st =>
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              )}
            </Field>
          </div>

          <Field name="caseNoteText" component={TextArea} title="Case Note" autocomplete="off" spellcheck="true"/>
          <Field name="occurrenceDateTime" component={OccurrenceDateTimePicker} editable locale={locale} title="Occurrence Date"/>

          <OccurrenceDateTimePicker locale={locale} title="Creation Date"/>

          <div>

            <button className="button col-xs-3" type="submit" disabled={submitting} submitting={submitting}>
              Submit
            </button>

            <button className="cancel-button col-xs-3" onClick={this.goBack}>
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
});

const validate = (stuff) => {
  if (!stuff) return {};
  const { caseNoteText, occurrenceDateTime, subTypeValue,typeValue } = stuff.toJS();
  const errors = {};

  if (! typeValue){
    errors.typeValue = 'Required';
  }

  if(! subTypeValue){
    errors.subTypeValue = 'Required';
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
    typeAndSubType: Map({ typeValue: '', subTypeValue: '', text: '' }),
  }),
})(AddCaseNoteForm);

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(asForm);
