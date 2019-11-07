import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import serialize from 'form-serialize'
import styled from 'styled-components'
import Button from '@govuk-react/button'
import { ButtonArrow } from '@govuk-react/icons'
import InputField from '@govuk-react/input-field'
import Select from '@govuk-react/select'
import { MEDIA_QUERIES } from '@govuk-react/constants'

import { buildSearchQueryString } from '../../utils/stringUtils'
import './searchForm.scss'
import history from '../../history'

const SearchField = styled(InputField)`
  ${MEDIA_QUERIES.LARGESCREEN} {
    width: 50%;
  }
`

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
          <h1 className="heading-large" data-qa="page-heading-text">
            Search for a prisoner
          </h1>

          <SearchField
            hint="Leave blank to view all results for selected location"
            mb={6}
            input={{
              autoComplete: 'off',
              name: 'keywords',
            }}
          >
            Prisoner name or number
          </SearchField>

          <Select label="Location" defaultValue={defaultLocationPrefix} mb={6} input={{ name: 'locationPrefix' }}>
            {locations.map(location => (
              <option key={location.locationPrefix} value={location.locationPrefix}>
                {location.description}
              </option>
            ))}
          </Select>

          <Button type="submit" start icon={<ButtonArrow />} mb={0} data-qa="search-button">
            Search
          </Button>
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
