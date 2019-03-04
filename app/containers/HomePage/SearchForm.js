import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import serialize from 'form-serialize'

import { buildSearchQueryString } from '../../utils/stringUtils'
import './searchForm.scss'
import history from '../../history'

export class SearchForm extends Component {
  onSubmit = formData => {
    history.push(`/results?${buildSearchQueryString(formData)}`)
  }

  handleSubmit = event => {
    event.preventDefault()
    const formData = serialize(event.target, { hash: true })
    this.onSubmit(formData)
  }

  render() {
    const { locations, defaultLocationPrefix, error } = this.props

    return (
      <form className="search-form" onSubmit={event => this.handleSubmit(event)}>
        {error ? (
          <div className="error-summary">
            <h2 className="heading-medium error-summary-heading">Search Error</h2>
            <div className="error-message">{error}</div>
          </div>
        ) : null}

        <div className="box">
          <h1 className="heading-large">Search for a prisoner</h1>

          <label htmlFor="keywords" className="form-label">
            Enter a prisoner name or number
          </label>

          <input
            name="keywords"
            type="text"
            title="Enter"
            autoComplete="off"
            className="form-control search-input"
          />
          <button type="submit" className="button button-start desktop-button">
            {' '}
            Search
          </button>

          <div className="location-select">
            <label htmlFor="location" className="form-label">
              Select housing location
            </label>
            <select className="form-control locationPrefix" name="locationPrefix" defaultValue={defaultLocationPrefix}>
              {locations.map(location => (
                <option key={location.locationPrefix} value={location.locationPrefix}>
                  {location.description}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="button mobile-button">
            {' '}
            Search{' '}
          </button>
        </div>
      </form>
    )
  }
}

SearchForm.propTypes = {
  defaultLocationPrefix: PropTypes.string,

  // mapStateToProps
  locations: PropTypes.arrayOf(
    PropTypes.shape({ locationPrefix: PropTypes.string.isRequired, description: PropTypes.string.isRequired })
  ).isRequired,
  error: PropTypes.string,
}

SearchForm.defaultProps = {
  error: '',
  defaultLocationPrefix: '',
}

const mapStateToProps = state => ({
  locations: state.getIn(['home', 'locations']).toJS(),
  error: state.getIn(['home', 'searchError']),
})

export default connect(mapStateToProps)(SearchForm)
