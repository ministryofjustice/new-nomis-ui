import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import serialize from 'form-serialize'

import { buildSearchQueryString, buildQueryString } from '../../utils/stringUtils'
import './searchForm.scss'
import history from '../../history'

export class SearchForm extends Component {
  constructor() {
    super()
    this.state = {
      doGlobalSearch: false,
    }
  }

  onSubmit = (formData, globalSearchUrl) => {
    if (globalSearchUrl) {
      window.location.assign(
        `${globalSearchUrl}?${buildQueryString({
          searchText: formData.keywords,
        })}`
      )
    } else {
      history.push(`/results?${buildSearchQueryString(formData)}`)
    }
  }

  handleSubmit = event => {
    event.preventDefault()
    const { globalSearchUrl, canGlobalSearch } = this.props
    const { doGlobalSearch } = this.state
    const formData = serialize(event.target, { hash: true })

    this.onSubmit(formData, canGlobalSearch && this.state && doGlobalSearch && globalSearchUrl)
  }

  handleGlobalSearchCheckBoxChange(currentValue) {
    this.setState({
      doGlobalSearch: !currentValue,
    })
  }

  render() {
    const { locations, defaultLocationPrefix, error, canGlobalSearch } = this.props
    const { doGlobalSearch } = this.state

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
            placeholder="Last Name, First Name or ID"
            autoComplete="off"
            className="form-control search-input"
          />
          <button type="submit" className="button button-start desktop-button">
            {' '}
            Search
          </button>

          <div className="location-with-global-search-checkbox">
            <div className="location-select">
              <label htmlFor="location" className="form-label">
                Select location
              </label>
              <select
                disabled={doGlobalSearch}
                className="form-control locationPrefix"
                name="locationPrefix"
                defaultValue={defaultLocationPrefix}
              >
                {locations.map(location => (
                  <option key={location.locationPrefix} value={location.locationPrefix}>
                    {location.description}
                  </option>
                ))}
              </select>

              {canGlobalSearch && (
                <div className="multiple-choice">
                  <input
                    name="global-search"
                    type="checkbox"
                    className="global-search"
                    value={doGlobalSearch}
                    onChange={() => this.handleGlobalSearchCheckBoxChange(doGlobalSearch)}
                  />
                  <label htmlFor="global-search"> Global search </label>
                </div>
              )}
            </div>
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
  canGlobalSearch: PropTypes.bool.isRequired,
  globalSearchUrl: PropTypes.string.isRequired,
}

SearchForm.defaultProps = {
  error: '',
  defaultLocationPrefix: '',
}

const mapStateToProps = state => {
  const user = state.getIn(['authentication', 'user'])

  return {
    locations: state.getIn(['home', 'locations']).toJS(),
    error: state.getIn(['home', 'searchError']),
    canGlobalSearch: (user && user.canGlobalSearch) || false,
    globalSearchUrl: state.getIn(['app', 'globalSearchUrl']),
  }
}

export default connect(mapStateToProps)(SearchForm)
