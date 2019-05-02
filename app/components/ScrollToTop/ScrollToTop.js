import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router-dom'

class ScrollToTop extends Component {
  componentDidMount() {
    console.log('and we are in component did mount')
    console.log(this.props.location)
  }

  componentDidUpdate(prevProps) {
    console.log('and we are in component did update')
    console.log(this.props.location)
    const { location } = this.props

    if (location !== prevProps.location) {
      window.scrollTo(0, 0)
      this.node.setAttribute('tabindex', -1)
      this.node.focus()
      this.node.removeAttribute('tabindex')
    }
  }

  setNode = n => {
    this.node = n
  }

  render() {
    const { children } = this.props

    return <div ref={this.setNode}>{children}</div>
  }
}

ScrollToTop.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  children: PropTypes.node.isRequired,
}

export default withRouter(ScrollToTop)
