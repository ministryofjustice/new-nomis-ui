import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Heading from '@govuk-react/heading'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  NavigationContainer,
  ContextLinkContainer,
  ContextLink,
  Container,
  PageHeader,
  PageHeaderLeft,
} from './Page.styles'
import { childrenType, routeMatchType, userType } from '../../types'
import Breadcrumb from '../Breadcrumb'
import PrintLink from './elements/PrintLink'

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
      showPrint,
      pathfinderId,
      pathfinderUrl,
      user,
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
          <PageHeader>
            <PageHeaderLeft>
              {title && (
                <Heading level={1} size="LARGE" data-qa="page-heading-text">
                  {title}
                </Heading>
              )}
              {user.isPathfinderUser && pathfinderId && pathfinderUrl && (
                <a id="pathfinder-profile-link" href={`${pathfinderUrl}/nominal/${pathfinderId}`} className="link">
                  View Pathfinder profile
                </a>
              )}
            </PageHeaderLeft>

            {showPrint && (
              <div>
                <PrintLink />
              </div>
            )}
          </PageHeader>
          <div className="page-content">{children}</div>
        </Container>
        {showPrint && <PrintLink bottom />}
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
  showPrint: PropTypes.bool,
  pathfinderUrl: PropTypes.string,
  user: userType,
}

Page.defaultProps = {
  docTitle: null,
  showBreadcrumb: true,
  searchContext: '',
  lastSearchResultQuery: null,
  showPrint: false,
  pathfinderUrl: null,
  user: {},
}

const mapStateToProps = state => ({
  searchContext: state.getIn(['app', 'searchContext']),
  lastSearchResultQuery: state.getIn(['search', 'lastSearchResultQuery']),
  pathfinderUrl: state.getIn(['app', 'pathfinderUrl']),
  user: state.getIn(['authentication', 'user']),
})

export default withRouter(connect(mapStateToProps)(Page))
