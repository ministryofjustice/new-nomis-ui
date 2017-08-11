import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import { Input, SubmissionError } from 'components/FormComponents';

import {
  NEW_SEARCH,
  SEARCH_ERROR,
  SEARCH_SUCCESS
} from '../constants'

import './SearchForm.scss';

import { createFormAction } from 'redux-form-saga';

class SearchAgainForm extends React.PureComponent{

     render(){

       const {handleSubmit,locations,submitting} = this.props;

        return (
          <form className="search-again" onSubmit={handleSubmit}>

            {this.props.error ?
              <div className="error-summary">
                  <h2 className="heading-medium error-summary-heading">
                      Search Error
                  </h2>
                  <div  className="error-message">
                    {this.props.error}
                  </div>
              </div>
              : null}

            <div className="filterBox">

              <div className="row col-md-4">

                <label className="form-label visible-md visible-lg">
                  Enter prisoner Name or ID
                </label>

                <Field name="keywords" component="input" type="text" title="Enter Name or ID" placeholder="Enter Name or ID" autoComplete="off" className="form-control" />

              </div>

              <div className="row col-md-4">
                <label className="form-label visible-md visible-lg">
                  Select location
                </label>

                <Field className="form-control" name="locationPrefix" component="select">>
                  {locations.map(location =>
                    <option key={location.description} value={location.description}> {location.description}</option>
                  )}
                </Field>

              </div>

              <div className="row col-md-3">

                <label className="form-label visible-md visible-lg">
                  &nbsp;
                </label>

                <div className="visible-md visible-lg">
                  <button className="button" type="submit" disabled={submitting} submitting={submitting}>
                    Search again
                  </button>
                </div>

                <div className="visible-xs visible-sm">
                  <button className="button" type="submit" disabled={submitting} submitting={submitting}>
                    Search again
                  </button>
                </div>

              </div>
            </div>
          </form>
        )
     }
}

SearchAgainForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

SearchAgainForm.defaultProps = {
  error: '',
};

export default reduxForm({
  form: 'search',
  onSubmit: createFormAction((formData) => ({ type: NEW_SEARCH, payload: { query: formData.toJS(), resetPagination: true } }), [SEARCH_SUCCESS, SEARCH_ERROR]),

})(SearchAgainForm);
