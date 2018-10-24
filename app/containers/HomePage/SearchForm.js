import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import serialize from 'form-serialize'

import { buildSearchQueryString } from 'utils/stringUtils'

import './searchForm.scss'

class SearchForm extends Component {
  handleSubmit(event) {
    const { onSubmit } = this.props
    event.preventDefault()
    const formData = serialize(event.target, { hash: true })
    onSubmit(formData, this.state && this.state.globalSearch)
  }

  handleGlobalSearchCheckBoxChange(currentValue) {
    this.setState({
      globalSearch: !currentValue,
    })
  }

  render() {
    const { locations, defaultLocationPrefix, error, canGlobalSearch } = this.props
    const { globalSearch } = this.state || {}

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

          <label className="form-label">Enter a prisoner name or number</label>

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
            <div>
              <label className="form-label">Select location</label>
              <select
                disabled={globalSearch}
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
            </div>

            {canGlobalSearch && (
              <div className="multiple-choice">
                <input
                  name="global-search"
                  type="checkbox"
                  className="global-search"
                  value={globalSearch}
                  onChange={() => this.handleGlobalSearchCheckBoxChange(globalSearch)}
                />
                <label htmlFor="global-search"> Global search </label>
              </div>
            )}
          </div>

          <button type="submit" className="button mobile-button">
            {' '}
            Search{' '}
          </button>

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
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    onSubmit: (formData, globalSearch) =>
      globalSearch
        ? dispatch(push(`${props.globalSearchUrl}?${buildSearchQueryString(formData)}`))
        : dispatch(push(`/results?${buildSearchQueryString(formData)}`)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchForm)
