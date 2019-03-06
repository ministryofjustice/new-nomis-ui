import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Header from '@govuk-react/header'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { NavigationContainer, ContextLinkContainer, ContextLink, Container, PageHeader } from './Page.styles'
import { childrenType, routeMatchType } from '../../types'
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
    document.title = `${docTitle || title} - Prison NOMIS`
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
            <Header level={1} size="LARGE" data-qa="page-heading-text">
              {title}
            </Header>
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
}

Page.defaultProps = {
  docTitle: null,
  showBreadcrumb: true,
  searchContext: '',
  lastSearchResultQuery: null,
  showPrint: false,
}

const mapStateToProps = state => ({
  searchContext: state.getIn(['app', 'searchContext']),
  lastSearchResultQuery: state.getIn(['search', 'lastSearchResultQuery']),
})

export default withRouter(connect(mapStateToProps)(Page))
