import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BreadcrumbsComponent from 'components/Breadcrumbs'

class Breadcrumbs extends Component {
  render() {
    const { user, route, searchContext, offenderNo, lastSearchResultQuery } = this.props

    return (
      user && (
        <BreadcrumbsComponent
          route={route}
          lastSearchResultQuery={lastSearchResultQuery}
          inmateData={{}}
          context={searchContext}
          offenderNo={offenderNo}
        />
      )
    )
  }
}

Breadcrumbs.propTypes = {
  user: PropTypes.object,
  route: PropTypes.string.isRequired,
  searchContext: PropTypes.string,
}

Breadcrumbs.defaultProps = {
  user: undefined,
  searchContext: '',
}

const mapStateToProps = state => ({
  user: state.getIn(['authentication', 'user']),
  searchContext: state.getIn(['app', 'searchContext']),
  lastSearchResultQuery: state.getIn(['search', 'lastSearchResultQuery']),
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Breadcrumbs)
