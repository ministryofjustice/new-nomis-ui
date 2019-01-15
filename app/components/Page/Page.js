import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Header from '@govuk-react/header'
import { Container } from './Page.styles'
import { childrenType } from '../../types'
import Breadcrumb from '../Breadcrumb'

export class Page extends Component {
  componentDidMount() {
    const { title } = this.props
    this.renderTitleString(title)
  }

  componentWillUpdate(nextProps) {
    this.renderTitleString(nextProps.title)
  }

  renderTitleString = title => {
    document.title = `${title} - Prison NOMIS`
  }

  render() {
    const { title, children, showBreadcrumb } = this.props

    return (
      <Fragment>
        {showBreadcrumb && <Breadcrumb />}
        <Container>
          <Header level={1} size="LARGE">
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
  children: childrenType.isRequired,
  showBreadcrumb: PropTypes.bool,
}

Page.defaultProps = {
  showBreadcrumb: true,
}

export default Page
