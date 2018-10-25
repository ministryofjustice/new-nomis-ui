import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { setDeviceFormat } from 'globalReducers/app'
import { retrieveUserMe } from 'containers/Authentication/actions'
import { selectShouldShowSpinner, selectShouldShowTerms, selectMobileMenuOpen } from 'selectors/app'
import Header from 'containers/Header'
import Breadcrumbs from 'containers/Breadcrumbs'
import Footer from 'containers/Footer'
import ProductGlobals from 'product-globals'
import Notifications from 'react-notify-toast'
import Spinner from 'components/Spinner'
import Terms from 'containers/Footer/terms-and-conditions'
import FeedbackLink from 'containers/FeedbackLink'
import axios from 'axios/index'

import { setMenuOpen, hideTerms, setAppConfig } from '../../globalReducers/app'

export class App extends Component {
  constructor(props) {
    super(props)
    this.resizeWindow = this.resizeWindow.bind(this)
    this.requestExternalUrls = this.requestExternalUrls.bind(this)
    window.addEventListener('resize', this.resizeWindow, true)
  }

  componentWillMount() {
    this.requestExternalUrls()
    this.resizeWindow()
  }

  componentDidMount() {
    const { retrieveUserMe } = this.props
    retrieveUserMe()
  }

  onBackgroundClick() {
    const { setMenuOpen } = this.props
    setMenuOpen(false)
  }

  requestExternalUrls() {
    const { setAppConfig } = this.props
    axios.get('/config').then(response => {
      setAppConfig(response.data)
    })
  }

  resizeWindow() {
    const { setDeviceFormat } = this.props
    if (window.innerWidth > 1024) {
      setDeviceFormat('desktop')
    } else {
      setDeviceFormat('mobile')
    }
  }

  render() {
    const {
      shouldShowSpinner,
      shouldShowTerms,
      hideTermsAndConditions,
      menuOpen,
      router,
      params,
      children,
    } = this.props

    return (
      <div className="app-content">
        <Notifications />

        <Helmet title={ProductGlobals.serviceName} />
        <Header />

        {!shouldShowTerms && <FeedbackLink />}

        <nav className="nav-container">
          <div className="nav-content">
            {!shouldShowTerms && <Breadcrumbs route={router.location.pathname} offenderNo={params.offenderNo} />}
          </div>
        </nav>

        <main className={`container ${menuOpen ? 'desktop-only' : ''}`} onClick={() => this.onBackgroundClick()}>
          {shouldShowSpinner && <Spinner />}
          {!shouldShowTerms && <div className="main-content">{React.Children.toArray(children)}</div>}
          {shouldShowTerms && <Terms close={() => hideTermsAndConditions()} />}
        </main>

        <div onClick={() => this.onBackgroundClick()}>
          <Footer />
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.node,
  setDeviceFormat: PropTypes.func,
  router: PropTypes.object.isRequired,
  setMenuOpen: PropTypes.func,
  retrieveUserMe: PropTypes.func,
}

App.defaultProps = {
  children: [],
  setDeviceFormat: () => {},
  retrieveUserMe: () => {},
  setMenuOpen: () => {},
}

const mapStateToProps = createStructuredSelector({
  shouldShowSpinner: selectShouldShowSpinner(),
  shouldShowTerms: selectShouldShowTerms(),
  menuOpen: selectMobileMenuOpen(),
})

const mapDispatchToProps = dispatch => ({
  retrieveUserMe: () => dispatch(retrieveUserMe()),
  setDeviceFormat: format => dispatch(setDeviceFormat(format)),
  hideTermsAndConditions: () => dispatch(hideTerms()),
  setMenuOpen: flag => dispatch(setMenuOpen(flag)),
  setAppConfig: config => dispatch(setAppConfig(config)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
