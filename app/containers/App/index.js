import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
// eslint-disable-next-line import/no-unresolved
import ProductGlobals from 'product-globals'
import Notifications from 'react-notify-toast'
import axios from 'axios/index'
import { retrieveUserMe } from '../Authentication/actions'
import { selectShouldShowSpinner, selectShouldShowTerms, selectMobileMenuOpen } from '../../selectors/app'
import Header from '../Header'
import Breadcrumbs from '../Breadcrumbs'
import Footer from '../Footer'
import Spinner from '../../components/Spinner'
import Terms from '../Footer/terms-and-conditions'
import FeedbackLink from '../FeedbackLink'

import { setAppConfig, setDeviceFormat, setMenuOpen, hideTerms } from '../../globalReducers/app'

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
    const { boundRetrieveUserMe } = this.props
    boundRetrieveUserMe()
  }

  onBackgroundClick() {
    const { boundSetMenuOpen } = this.props
    boundSetMenuOpen(false)
  }

  requestExternalUrls() {
    const { boundSetAppConfig } = this.props
    axios.get('/config').then(response => {
      boundSetAppConfig(response.data)
    })
  }

  resizeWindow() {
    const { boundSetDeviceFormat } = this.props
    if (window.innerWidth > 1024) {
      boundSetDeviceFormat('desktop')
    } else {
      boundSetDeviceFormat('mobile')
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
        {/* eslint-disable-next-line */}
        <main className={`container ${menuOpen ? 'desktop-only' : ''}`} onClick={() => this.onBackgroundClick()}>
          {shouldShowSpinner && <Spinner />}
          {!shouldShowTerms && <div className="main-content">{React.Children.toArray(children)}</div>}
          {shouldShowTerms && <Terms close={() => hideTermsAndConditions()} />}
        </main>
        {/* eslint-disable-next-line */}
        <div onClick={() => this.onBackgroundClick()}>
          <Footer />
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.node,
  boundSetDeviceFormat: PropTypes.func,
  router: PropTypes.object.isRequired,
  boundSetMenuOpen: PropTypes.func,
  boundRetrieveUserMe: PropTypes.func,
}

App.defaultProps = {
  children: [],
  boundSetDeviceFormat: () => {},
  boundRetrieveUserMe: () => {},
  boundSetMenuOpen: () => {},
}

const mapStateToProps = createStructuredSelector({
  shouldShowSpinner: selectShouldShowSpinner(),
  shouldShowTerms: selectShouldShowTerms(),
  menuOpen: selectMobileMenuOpen(),
})

const mapDispatchToProps = dispatch => ({
  boundRetrieveUserMe: () => dispatch(retrieveUserMe()),
  boundSetDeviceFormat: format => dispatch(setDeviceFormat(format)),
  hideTermsAndConditions: () => dispatch(hideTerms()),
  boundSetMenuOpen: flag => dispatch(setMenuOpen(flag)),
  boundSetAppConfig: config => dispatch(setAppConfig(config)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
