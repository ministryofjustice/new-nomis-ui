import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import qs from 'querystring'
import { Link } from 'react-router-dom'
import { Model as offenderDetailsModel } from '../../helpers/dataMappers/offenderDetails'
import { toFullName, properCase } from '../../utils/stringUtils'
import { DETAILS_TABS } from '../Bookings/constants'

const normaliseName = name => {
  const formatted = name
    .replace('-', ' ')
    .split(/(?=[A-Z])/)
    .map(s => s.toLowerCase())
    .join(' ')

  return properCase(formatted)
}

const getRouteForBookingTab = (url, offenderNo) => {
  const parts = url.split('/')
  const lastPart = parts[parts.length - 1]
  const values = Object.keys(DETAILS_TABS).map(key => DETAILS_TABS[key])
  const isTab = Boolean(lastPart && values.filter(v => v === lastPart).length > 0)

  return isTab && { name: normaliseName(lastPart), route: `/offenders/${offenderNo}/${lastPart}` }
}

export const buildBreadcrumb = ({ route, lastSearchResultQuery, offender, context, offenderNo }) => {
  const nameString =
    offender && toFullName({ firstName: offender.get('firstName'), lastName: offender.get('lastName') })

  if (route === '/') {
    return []
  }

  const homeCrumb = { name: 'Home', route: '/' }
  const assignments = { route: '/myKeyWorkerAllocations', name: 'My key worker allocations' }
  const bookingDetailsEntry = { name: nameString || offenderNo, route: `/offenders/${offenderNo}/quick-look` }

  let searchContext = null

  if (context === 'assignments') {
    searchContext = assignments
  }

  if (context === 'results') {
    const queryString = qs.stringify(lastSearchResultQuery)
    const url = '/results'

    searchContext = { name: 'Results', route: queryString ? `${url}?${queryString}` : url }
  }

  let offenderBasedBreadcrumbs = []

  if (searchContext) {
    offenderBasedBreadcrumbs = [homeCrumb, searchContext, bookingDetailsEntry]
  } else {
    offenderBasedBreadcrumbs = [homeCrumb, bookingDetailsEntry]
  }

  const bookingTabRoute = getRouteForBookingTab(route, offenderNo)

  if (bookingTabRoute) {
    return [...offenderBasedBreadcrumbs, bookingTabRoute]
  }

  const routes = route
    .substring(1)
    .split('/')
    .filter(part => !!part)
    .map(r => ({
      name: normaliseName(r),
      route: `${route.substring(0, route.indexOf(r))}${r}`,
      isOffenderRoute: r === offenderNo || r === 'offenders',
    }))

  const isOffenderRoute = routes.filter(r => r.isOffenderRoute).length > 0

  if (isOffenderRoute) {
    return [...offenderBasedBreadcrumbs, ...routes.filter(r => !r.isOffenderRoute)]
  }

  return [homeCrumb, ...routes]
}

class Breadcrumbs extends Component {
  render() {
    const { user, route, searchContext, offenderNo, lastSearchResultQuery, offenderDetails } = this.props

    const breadcrumbArray = buildBreadcrumb({
      route,
      lastSearchResultQuery,
      offender: offenderDetails,
      context: searchContext,
      offenderNo,
    })

    return (
      user && (
        <div className="bread-crumbs col-xs-12 no-left-gutter" data-name="Breadcrumbs">
          {breadcrumbArray.map((breadcrumb, i) =>
            i !== breadcrumbArray.length - 1 ? (
              <span className="link-wrapper" key={breadcrumb.name}>
                <Link to={breadcrumb.route} key={breadcrumb.name} className="crumb">
                  {breadcrumb.name}
                </Link>
                <span>{' > '}</span>
              </span>
            ) : (
              <span className="font-xsmall" key={breadcrumb.name}>
                {breadcrumb.name}
              </span>
            )
          )}
        </div>
      )
    )
  }
}

Breadcrumbs.propTypes = {
  route: PropTypes.string.isRequired,
  offenderNo: PropTypes.string,

  // mapStateToProps
  user: PropTypes.shape({}),
  searchContext: PropTypes.string,
  lastSearchResultQuery: PropTypes.shape({}),
  offenderDetails: ImmutablePropTypes.map.isRequired,
}

Breadcrumbs.defaultProps = {
  user: undefined,
  searchContext: '',
  lastSearchResultQuery: null,
  offenderNo: '',
}

const mapStateToProps = (state, props) => ({
  user: state.getIn(['authentication', 'user']),
  searchContext: state.getIn(['app', 'searchContext']),
  lastSearchResultQuery: state.getIn(['search', 'lastSearchResultQuery']),
  offenderDetails:
    state.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Data']) || offenderDetailsModel,
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Breadcrumbs)
