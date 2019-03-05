import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Header from '@govuk-react/header'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { NavigationContainer, ContextLinkContainer, ContextLink, Container } from './Page.styles'
import { childrenType, routeMatchType } from '../../types'
import Breadcrumb from '../Breadcrumb'

export class Page extends Component {
  componentDidMount() {
    const { title, docTitle } = this.props
    this.renderTitleString(title, docTitle)
  }

  componentWillUpdate(nextProps) {
    const { title, docTitle } = nextProps
    this.renderTitleString(title, docTitle)
  }

  renderTitleString = (title, docTitle) => {
    document.title = `${docTitle || title} - Digital Prison Services`
  }

  render() {
    const {
      title,
      children,
      showBreadcrumb,
      searchContext,
      lastSearchResultQuery,
      match: {
        params: { offenderNo },
      },
    } = this.props
    const showRecentResultsLink = searchContext === 'results' && offenderNo

    return (
      <Fragment>
        {(showRecentResultsLink || showBreadcrumb) && (
          <NavigationContainer>
            {showRecentResultsLink && (
              <ContextLinkContainer>
                <ContextLink to={`/results?${lastSearchResultQuery}`}>View most recent search</ContextLink>
              </ContextLinkContainer>
            )}
            {showBreadcrumb && <Breadcrumb />}
          </NavigationContainer>
        )}
        <Container>
          <Header level={1} size="LARGE" data-qa="page-heading-text">
            {title}
          </Header>
          <div className="page-content">{children}</div>
        </Container>
      </Fragment>
    )
  }
}

Page.propTypes = {
  title: PropTypes.string.isRequired,
  docTitle: PropTypes.string,
  children: childrenType.isRequired,
  showBreadcrumb: PropTypes.bool,
  searchContext: PropTypes.string,
  lastSearchResultQuery: PropTypes.string,
  match: routeMatchType.isRequired,
}

Page.defaultProps = {
  docTitle: null,
  showBreadcrumb: true,
  searchContext: '',
  lastSearchResultQuery: null,
}

const mapStateToProps = state => ({
  searchContext: state.getIn(['app', 'searchContext']),
  lastSearchResultQuery: state.getIn(['search', 'lastSearchResultQuery']),
})

export default withRouter(connect(mapStateToProps)(Page))
