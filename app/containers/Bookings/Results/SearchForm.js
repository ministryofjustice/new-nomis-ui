import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import serialize from 'form-serialize'
import { buildSearchQueryString } from '../../../utils/stringUtils'
import { linkOnClick } from '../../../helpers'

import './SearchForm.scss'

class SearchAgainForm extends Component {
  componentWillMount() {
    const { alerts } = this.props
    this.state = {
      showFilters: false,
      alerts: alerts || [],
    }
  }

  handleSubmit(event) {
    const { onSubmit } = this.props
    event.preventDefault()
    const formData = serialize(event.target, { hash: true })
    onSubmit(formData)
  }

  render() {
    const clearFlags = () => {
      const { showFilters } = this.state
      this.setState({
        showFilters,
        alerts: [],
      })
    }

    const toggleDetails = event => {
      event.preventDefault()
      const { showFilters, alerts } = this.state
      this.setState({
        showFilters: !showFilters,
        alerts: showFilters ? [] : alerts,
      })
    }

    const toggleCheckBox = event => {
      const { alerts, showFilters } = this.state
      const code = event.target.value

      const exists = alerts.find(alert => alert === code)
      if (exists) {
        this.setState({
          showFilters,
          alerts: [...alerts.filter(alert => alert !== code)],
        })
      } else {
        this.setState({
          showFilters,
          alerts: [...alerts, code],
        })
      }
    }

    const { error, locations, submitting, locationPrefix, keywords } = this.props
    const { showFilters, alerts: checkedAlerts } = this.state
    const isTicked = code => checkedAlerts.indexOf(code) >= 0

    const AlertCheckbox = ({ code, colClasses, content, onChange }) => {
      const classes = `${colClasses} multiple-choice in-rows`
      return (
        <div className={classes}>
          <input
            id={code}
            type="checkbox"
            name="alerts"
            value={code}
            defaultChecked={isTicked(code)}
            onChange={onChange}
          />
          <label className="add-checkbox-label-margin-left" htmlFor={code}>
            {content}
          </label>
        </div>
      )
    }

    return (
      <form className="search-again" onSubmit={event => this.handleSubmit(event)}>
        {error ? (
          <div className="error-summary">
            <h2 className="heading-medium error-summary-heading">Search Error</h2>
            <div className="error-message">{error}</div>
          </div>
        ) : null}

        <div className="filter-box">
          <div className="row col-md-4">
            <label htmlFor="keywords" className="form-label visible-md visible-lg">
              Enter prisoner Name or ID
            </label>

            <input
              name="keywords"
              id="keywords"
              type="text"
              title="Last Name, First Name or ID"
              placeholder="Last Name, First Name or ID"
              autoComplete="off"
              className="form-control"
              defaultValue={keywords}
            />
          </div>

          <div className="row col-md-4">
            <label htmlFor="location" className="form-label visible-md visible-lg">
              Select location
            </label>
            <select className="form-control" name="locationPrefix" id="location" defaultValue={locationPrefix}>
              {locations.map(location => (
                <option key={location.get('locationPrefix')} value={location.get('locationPrefix')}>
                  {location.get('description')}
                </option>
              ))}
            </select>
          </div>

          <div className="row col-md-3">
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

          <details className="govuk-details add-gutter-padding-top visible-md visible-lg" open={showFilters}>
            <summary
              className="govuk-details__summary"
              onClick={event => toggleDetails(event)}
              onKeyDown={() => {}}
              tabIndex="0"
              role="switch"
              aria-checked={false}
            >
              <span className="govuk-details__summary-text">{showFilters ? 'Show filters' : 'Hide filters'}</span>
            </summary>
            <div className="govuk-details__text add-gutter-margin-left">
              <div className="row col-md-11 no-left-gutter add-gutter-margin-bottom">
                <b>Flags</b>
              </div>
              <div className="row">
                <AlertCheckbox
                  code="HA"
                  colClasses="col-md-3"
                  content="ACCT open"
                  onChange={event => toggleCheckBox(event)}
                />
                <AlertCheckbox
                  code="PEEP"
                  colClasses="col-md-3"
                  content="PEEP (disability)"
                  onChange={event => toggleCheckBox(event)}
                />
                <AlertCheckbox
                  code="XEL"
                  colClasses="col-md-3"
                  content="E-List"
                  onChange={event => toggleCheckBox(event)}
                />
              </div>
              <div className="row">
                <AlertCheckbox
                  code="XSA"
                  colClasses="col-md-3"
                  content="Staff assaulter"
                  onChange={event => toggleCheckBox(event)}
                />
                <AlertCheckbox
                  code="XA"
                  colClasses="col-md-3"
                  content="Arsonist"
                  onChange={event => toggleCheckBox(event)}
                />
                <AlertCheckbox
                  code="XTACT"
                  colClasses="col-md-3"
                  content="TACT"
                  onChange={event => toggleCheckBox(event)}
                />
                <AlertCheckbox
                  code="XRF"
                  colClasses="col-md-3"
                  content="Risk to females"
                  onChange={event => toggleCheckBox(event)}
                />
              </div>
              <div className="row col-md-11 no-left-gutter add-gutter-margin-top">
                <a className="link clickable" {...linkOnClick(clearFlags)}>
                  Clear filters
                </a>
              </div>
            </div>
          </details>
        </div>
      </form>
    )
  }
}

SearchAgainForm.propTypes = {
  error: PropTypes.string, // isOneOf ([object, string ?
  locations: ImmutablePropTypes.list.isRequired,
}

SearchAgainForm.defaultProps = {
  error: '',
}

const mapStateToProps = (state, props) => ({
  keywords: props.query.keywords || '',
  locationPrefix: props.query.locationPrefix || (props.locations.length && props.locations[0].locationPrefix),
  alerts: props.query.alerts || [],
  error: state.getIn(['home', 'searchError']),
})

const mapDispatchToProps = dispatch => ({
  onSubmit: formData => dispatch(push(`/results?${buildSearchQueryString(formData)}`)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchAgainForm)
