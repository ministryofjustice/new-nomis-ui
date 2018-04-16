import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import serialize from 'form-serialize';

import { buildSearchQueryString } from 'utils/stringUtils';

import './SearchForm.scss';

class SearchAgainForm extends Component {
  handleSubmit(event) {
    event.preventDefault();
    const formData = serialize(event.target, { hash: true });
    this.props.onSubmit(formData);
  }

  render() {
    const { error, locations, submitting, locationPrefix, keywords } = this.props;

    return (
      <form className="search-again" onSubmit={event => this.handleSubmit(event)}>
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

        <div className="filter-box">

          <div className="row col-md-4">

            <label className="form-label visible-md visible-lg">
              Enter prisoner Name or ID
            </label>

            <input
              name="keywords"
              type="text"
              title="Last Name, First Name or ID"
              placeholder="Last Name, First Name or ID"
              autoComplete="off"
              className="form-control"
              defaultValue={keywords}
            />

          </div>

          <div className="row col-md-4">
            <label className="form-label visible-md visible-lg">
              Select location
            </label>
            <select className="form-control" name="locationPrefix" defaultValue={locationPrefix}>
              {locations.map((location) =>
                <option key={location.get('locationPrefix')} value={location.get('locationPrefix')}>{location.get('description')}</option>
              )}
            </select>
          </div>

          <div className="row col-md-3">
            <label className="form-label visible-md visible-lg">
                &nbsp;
            </label>

            <div className="visible-md visible-lg">
              <button className="button" type="submit" disabled={submitting}>
                Search again
              </button>
            </div>

            <div className="visible-xs visible-sm">
              <button className="button" type="submit" disabled={submitting}>
                Search again
              </button>
            </div>

          </div>
        </div>
      </form>
    );
  }
}

SearchAgainForm.propTypes = {
  error: PropTypes.string,
  locations: ImmutablePropTypes.list.isRequired,
};

SearchAgainForm.defaultProps = {
  error: '',
};

function mapStateToProps(state, props) {
  return {
    keywords: props.query.keywords || '',
    locationPrefix: props.query.locationPrefix || (props.locations.length && props.locations[0].locationPrefix),
    error: state.getIn(['home','searchError']),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (formData) => dispatch(push(`/results?${buildSearchQueryString(formData)}`)) ,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchAgainForm)
