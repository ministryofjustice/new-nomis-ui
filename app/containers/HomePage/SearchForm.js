import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import serialize from 'form-serialize'

import { buildSearchQueryString, buildQueryString } from '../../utils/stringUtils'

import './searchForm.scss'

class SearchForm extends Component {
  constructor() {
    super()
    this.state = {
      doGlobalSearch: false,
    }
  }

  handleSubmit(event) {
    event.preventDefault()

    const { onSubmit, globalSearchUrl, canGlobalSearch } = this.props
    const { doGlobalSearch } = this.state
    const formData = serialize(event.target, { hash: true })

    onSubmit(formData, canGlobalSearch && this.state && doGlobalSearch && globalSearchUrl)
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
  locations: PropTypes.array.isRequired,
  error: PropTypes.string,
}

SearchForm.defaultProps = {
  error: '',
}

function mapStateToProps(state) {
  const user = state.getIn(['authentication', 'user'])

  return {
    defaultLocationPrefix: '',
    error: state.getIn(['home', 'searchError']),
    canGlobalSearch: user && user.canGlobalSearch,
    globalSearchUrl: state.getIn(['app', 'globalSearchUrl']),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit(formData, globalSearchUrl) {
      if (globalSearchUrl)
        window.location.assign(
          `${globalSearchUrl}?${buildQueryString({
            keywords: formData.keywords,
          })}`
        )
      else return dispatch(push(`/results?${buildSearchQueryString(formData)}`))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchForm)
