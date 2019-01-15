import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Header from '@govuk-react/header'
import { Container } from './Page.styles'
import { childrenType } from '../../types'
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
    document.title = `${docTitle || title} - Prison NOMIS`
  }

  render() {
    const { title, children, showBreadcrumb } = this.props

    return (
      <Fragment>
        {showBreadcrumb && <Breadcrumb />}
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
}

Page.defaultProps = {
  docTitle: null,
  showBreadcrumb: true,
}

export default Page
