
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import { createFormAction } from 'redux-form-saga';

import {
  NEW_SEARCH,
  SEARCH_SUCCESS,
  SEARCH_ERROR,
} from '../Bookings/constants';

import './searchForm.scss';

class SearchForm extends PureComponent {  // eslint-disable-line react/prefer-stateless-function

  render() {
    const { handleSubmit, locations, submitting } = this.props;

    return (
      <form className="search-form" onSubmit={handleSubmit}>

        {this.props.error ?
          <div className="error-summary">
            <h2 className="heading-medium error-summary-heading">
              Search Error
            </h2>
            <div className="error-message">
              {this.props.error}
            </div>
          </div>
          : null}

        <div className="box">
          <h1 className="heading-large" >Search for a prisoner</h1>

          <label className="form-label">
            Enter a prisoner name or number
          </label>

          <Field name="keywords" component="input" type="text" title="Enter " placeholder="Last Name, First Name or ID" autoComplete="off" className="form-control search-input" />
          <button type="submit" className="button button-start desktop-button" disabled={submitting}> Search</button>

          <div>
            <label className="form-label">
              Select location
            </label>
            <Field className="form-control" name="locationPrefix" component="select">
              <option>All</option>
              {locations.map((location) =>
                <option key={location.locationPrefix} value={location.locationPrefix}>{location.description}</option>
              )}
            </Field>
          </div>

          <button type="submit" className="button mobile-button" disabled={submitting}> Search </button>

        </div>
      </form>);
  }
}
SearchForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  locations: PropTypes.array.isRequired,
  error: PropTypes.string,
};

SearchForm.defaultProps = {
  error: '',
};

export default reduxForm({
  form: 'search',
  onSubmit: createFormAction((formData) => ({
    type: NEW_SEARCH,
    redirectToResults: true,
    payload: {
      query: formData.toJS(),
      resetPagination: true,
      pagination: {
        perPage: 10,
      },
      sortOrder: 'ASC',
    },
  }), [SEARCH_SUCCESS, SEARCH_ERROR]),

})(SearchForm);
