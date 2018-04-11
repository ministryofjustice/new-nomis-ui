
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import serialize from 'form-serialize';

import './searchForm.scss';
import { bookingSearch } from '../Bookings/actions';

class SearchForm extends Component { 

  handleSubmit(event) {
    event.preventDefault();
    const formData = serialize(event.target, { hash: true });
    this.props.onSubmit(formData);
  }
  render() {
    const { locations, defaultLocationPrefix, error } = this.props;

    return (
      <form className="search-form" onSubmit={event => this.handleSubmit(event)}>

        {error ?
          <div className="error-summary">
            <h2 className="heading-medium error-summary-heading">
              Search Error
            </h2>
            <div className="error-message">
              {error}
            </div>
          </div>
          : null}

        <div className="box">
          <h1 className="heading-large" >Search for a prisoner</h1>

          <label className="form-label">
            Enter a prisoner name or number
          </label>

          <input name="keywords" type="text" title="Enter " placeholder="Last Name, First Name or ID" autoComplete="off" className="form-control search-input" />
          <button type="submit" className="button button-start desktop-button"> Search</button>

          <div>
            <label className="form-label">
              Select location
            </label>
            <select className="form-control" name="locationPrefix" defaultValue={defaultLocationPrefix}>
              {locations.map((location) =>
                <option key={location.locationPrefix} value={location.locationPrefix}>
                  {location.description}
                 </option>
              )}
            </select>
          </div>

          <button type="submit" className="button mobile-button"> Search </button>

        </div>
      </form>);
  }
}
SearchForm.propTypes = {
  locations: PropTypes.array.isRequired,
  error: PropTypes.string,
};

SearchForm.defaultProps = {
  error: '',
};

function mapStateToProps(state, props) {
  return {
    defaultLocationPrefix: '',
    error: state.getIn(['home','searchError']),
  }
}

function mapDispatchToProps(dispatch) {
  return ({
    onSubmit: (formData) => dispatch(bookingSearch(formData)),
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm)
