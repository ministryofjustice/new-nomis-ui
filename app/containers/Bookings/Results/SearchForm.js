import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Checkbox from '@govuk-react/checkbox'
import { buildSearchQueryString } from '../../../utils/stringUtils'
import { linkOnClick } from '../../../helpers'
import history from '../../../history'

import './SearchForm.scss'

class SearchAgainForm extends Component {
  constructor(props) {
    const asArray = data => {
      if (!data) return []
      if (Array.isArray(data)) return data
      return [data]
    }
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.clearFlags = this.clearFlags.bind(this)

    this.state = {
      showFilters: false,
      checkedAlerts: asArray(props.query.alerts),
      locationPrefix: props.query.locationPrefix,
      keywords: props.query.keywords || '',
    }
  }

  handleSubmit(event) {
    const {
      query: { sortFields, sortOrder },
    } = this.props
    const { locationPrefix, keywords, checkedAlerts } = this.state
    event.preventDefault()
    const formData = {
      locationPrefix,
      keywords,
      alerts: checkedAlerts,
      sortFields,
      sortOrder,
    }
    history.push(`/results?${buildSearchQueryString(formData)}`)
  }

  handleChange(event) {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  clearFlags() {
    const {
      query: { sortFields, sortOrder },
    } = this.props
    const { locationPrefix, keywords } = this.state
    const formData = {
      locationPrefix,
      keywords,
      sortFields,
      sortOrder,
    }
    this.setState({ checkedAlerts: [] })
    history.push(`/results?${buildSearchQueryString(formData)}`)
  }

  render() {
    const toggleDetails = event => {
      event.preventDefault()
      const { showFilters, checkedAlerts } = this.state
      this.setState({
        showFilters: !showFilters,
        checkedAlerts: showFilters ? [] : checkedAlerts,
      })
    }

    const toggleCheckBox = event => {
      const { checkedAlerts } = this.state
      const code = event.target.value

      const exists = checkedAlerts.includes(code)
      if (exists) {
        this.setState({
          checkedAlerts: checkedAlerts.filter(alert => alert !== code),
        })
      } else {
        this.setState({
          checkedAlerts: [...checkedAlerts, code],
        })
      }
    }

    const { error, locations, submitting } = this.props

    const { locationPrefix, keywords } = this.state

    const { showFilters, checkedAlerts } = this.state
    const isTicked = code => checkedAlerts.includes(code)

    const AlertCheckbox = ({ code, colClasses, content, onChange }) => {
      const classes = `${colClasses} multiple-choice no-left-gutter`
      return (
        <div className={classes}>
          <Checkbox
            id={code}
            type="checkbox"
            name="alerts"
            value={code}
            defaultChecked={isTicked(code)}
            onChange={onChange}
          >
            {content}
          </Checkbox>
        </div>
      )
    }

    return (
      <form className="search-again" onSubmit={this.handleSubmit}>
        {error ? (
          <div className="error-summary">
            <h2 className="heading-medium error-summary-heading">Search Error</h2>
            <div className="error-message">{error}</div>
          </div>
        ) : null}

        <div className="filter-box">
          <div className="row">
            <div className="col-md-4 no-right-gutter">
              <label htmlFor="keywords" className="form-label visible-md visible-lg">
                Enter a prisoner name or number
              </label>

              <input
                name="keywords"
                id="keywords"
                type="text"
                title="Enter a prisoner name or number"
                autoComplete="off"
                className="form-control"
                value={keywords}
                onChange={this.handleChange}
              />
            </div>

            <div className="col-md-4 no-right-gutter">
              <label htmlFor="location" className="form-label visible-md visible-lg">
                Select housing location
              </label>
              <select
                className="form-control"
                name="locationPrefix"
                id="location"
                value={locationPrefix}
                onChange={this.handleChange}
              >
                {locations.map(location => (
                  <option key={location.get('locationPrefix')} value={location.get('locationPrefix')}>
                    {location.get('description')}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 no-right-gutter">
              <span className="form-label visible-md visible-lg">&nbsp;</span>

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

          <div className="row">
            <div className="col-md-12">
              <details className="govuk-details visible-md visible-lg" open={showFilters}>
                <summary
                  className="govuk-details__summary"
                  onClick={toggleDetails}
                  onKeyDown={() => {}}
                  tabIndex="0"
                  role="switch"
                  aria-checked={showFilters}
                >
                  <span className="govuk-details__summary-text">Filters</span>
                </summary>
                {showFilters && (
                  <div className="govuk-details__text">
                    <div className="add-gutter-margin-bottom">
                      <b>Flags</b>
                    </div>
                    <div className="row">
                      <AlertCheckbox code="HA" colClasses="col-md-3" content="ACCT open" onChange={toggleCheckBox} />
                      <AlertCheckbox
                        code="PEEP"
                        colClasses="col-md-3"
                        content="PEEP (disability)"
                        onChange={toggleCheckBox}
                      />
                      <AlertCheckbox code="XEL" colClasses="col-md-3" content="E-List" onChange={toggleCheckBox} />
                    </div>
                    <div className="row">
                      <AlertCheckbox
                        code="XSA"
                        colClasses="col-md-3"
                        content="Staff assaulter"
                        onChange={toggleCheckBox}
                      />
                      <AlertCheckbox code="XA" colClasses="col-md-3" content="Arsonist" onChange={toggleCheckBox} />
                      <AlertCheckbox code="XTACT" colClasses="col-md-3" content="TACT" onChange={toggleCheckBox} />
                      <AlertCheckbox
                        code="XRF"
                        colClasses="col-md-3"
                        content="Risk to females"
                        onChange={toggleCheckBox}
                      />
                    </div>
                    <a className="clear-filters link clickable" {...linkOnClick(this.clearFlags)}>
                      Clear filters
                    </a>
                  </div>
                )}
              </details>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

SearchAgainForm.propTypes = {
  error: PropTypes.string, // isOneOf ([object, string ?
  locations: ImmutablePropTypes.list.isRequired,
  query: PropTypes.shape({
    locationPrefix: PropTypes.string,
    keywords: PropTypes.string,
    alerts: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    sortFields: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    sortOrder: PropTypes.string,
  }),
  submitting: PropTypes.bool,
}

SearchAgainForm.defaultProps = {
  error: '',
  query: {
    locationPrefix: '',
    keywords: '',
    alerts: [],
  },
  submitting: false,
}

const mapStateToProps = state => ({
  error: state.getIn(['home', 'searchError']),
})

export default connect(mapStateToProps)(SearchAgainForm)
