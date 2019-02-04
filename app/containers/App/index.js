import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
// eslint-disable-next-line import/no-unresolved
import Notifications from 'react-notify-toast'
import axios from 'axios/index'
import { Route, withRouter, Switch } from 'react-router-dom'
import { retrieveUserMe } from '../Authentication/actions'
import { selectShouldShowSpinner, selectShouldShowTerms, selectMobileMenuOpen, selectMailTo } from '../../selectors/app'
import Header from '../Header'
// import Footer from '../Footer'
import Footer from '../../components/Footer'
import Spinner from '../../components/Spinner'
import Terms from '../Footer/terms-and-conditions'
import { setAppConfig, setDeviceFormat, setMenuOpen, hideTerms, showTerms } from '../../globalReducers/app'

const RouteWithSubRoutes = route => (
  <Route path={route.path} exact={route.exact} render={props => <route.component {...props} />} />
)

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
      routes,
      showTermsAndConditions,
      mailTo,
    } = this.props

    return (
      <div className="app-content">
        <Notifications />
        <Header />
        {/* eslint-disable-next-line */}
        <main className={`container ${menuOpen ? 'desktop-only' : ''}`} onClick={() => this.onBackgroundClick()}>
          {shouldShowSpinner && <Spinner />}
          {!shouldShowTerms && (
            <div className="main-content">
              <Switch>
                {routes.map(route => (
                  <RouteWithSubRoutes key={route.name} {...route} />
                ))}
              </Switch>
            </div>
          )}
          {shouldShowTerms && <Terms close={() => hideTermsAndConditions()} />}
        </main>
        {/* eslint-disable-next-line */}
        <div onClick={() => this.onBackgroundClick()}>
          <Footer
            meta={{
              items: [
                { text: 'Contact us', href: `mailto:${mailTo}` },
                { text: 'Terms and conditions', clickHandler: showTermsAndConditions },
              ],
            }}
          />
        </div>
      </div>
    )
  }
}

App.propTypes = {
  // mapStateToProps
  shouldShowSpinner: PropTypes.bool.isRequired,
  shouldShowTerms: PropTypes.bool.isRequired,
  menuOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
  mailTo: PropTypes.string.isRequired,

  // mapDispatchToProps
  boundRetrieveUserMe: PropTypes.func.isRequired,
  boundSetDeviceFormat: PropTypes.func.isRequired,
  hideTermsAndConditions: PropTypes.func.isRequired,
  boundSetMenuOpen: PropTypes.func.isRequired,
  boundSetAppConfig: PropTypes.func.isRequired,
  showTermsAndConditions: PropTypes.func.isRequired,

  // other
  history: ReactRouterPropTypes.history.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      name: PropTypes.string,
      component: PropTypes.function,
    })
  ).isRequired,
}

App.defaultProps = {
  children: [],
}

const mapStateToProps = createStructuredSelector({
  shouldShowSpinner: selectShouldShowSpinner(),
  shouldShowTerms: selectShouldShowTerms(),
  menuOpen: selectMobileMenuOpen(),
  mailTo: selectMailTo(),
})

const mapDispatchToProps = dispatch => ({
  boundRetrieveUserMe: () => dispatch(retrieveUserMe()),
  boundSetDeviceFormat: format => dispatch(setDeviceFormat(format)),
  hideTermsAndConditions: () => dispatch(hideTerms()),
  boundSetMenuOpen: flag => dispatch(setMenuOpen(flag)),
  boundSetAppConfig: config => dispatch(setAppConfig(config)),
  showTermsAndConditions: () => dispatch(showTerms()),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
)
