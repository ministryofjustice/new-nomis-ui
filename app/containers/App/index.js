import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Notifications from 'react-notify-toast'
import axios from 'axios/index'
import { Route, withRouter, Switch } from 'react-router-dom'
import { FooterContainer } from 'new-nomis-shared-components'
import { retrieveUserMe } from '../Authentication/actions'
import {
  selectSpinnerCount,
  selectMobileMenuOpen,
  selectPrisonStaffHubUrl,
  selectCategorisationUrl,
  selectOmicUrl,
  selectSupportUrl,
} from '../../selectors/app'
import Header from '../Header'
import Spinner from '../../components/Spinner'
import { setAppConfig, setDeviceFormat, setMenuOpen } from '../../globalReducers/app'

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
    const { spinnerCount, menuOpen, routes, prisonStaffHubUrl, boundSetMenuOpen, omicUrl, supportUrl } = this.props

    return (
      <div className="app-content">
        <Notifications />
        <Header prisonStaffHubUrl={prisonStaffHubUrl} setMenuOpen={boundSetMenuOpen} omicUrl={omicUrl} />
        {/* eslint-disable-next-line */}
        <main className={`container ${menuOpen ? 'desktop-only' : ''}`} onClick={() => this.onBackgroundClick()}>
          {spinnerCount > 0 && <Spinner />}
          <div className="main-content">
            <Switch>
              {routes.map(route => (
                <RouteWithSubRoutes key={route.name} {...route} />
              ))}
            </Switch>
          </div>
        </main>
        {/* eslint-disable-next-line */}
        <div onClick={() => this.onBackgroundClick()}>
          <FooterContainer supportUrl={`${supportUrl}feedback-and-support`} prisonStaffHubUrl={prisonStaffHubUrl} />
        </div>
      </div>
    )
  }
}

App.propTypes = {
  // mapStateToProps
  spinnerCount: PropTypes.number.isRequired,
  menuOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
  prisonStaffHubUrl: PropTypes.string.isRequired,
  omicUrl: PropTypes.string.isRequired,

  // mapDispatchToProps
  boundRetrieveUserMe: PropTypes.func.isRequired,
  boundSetDeviceFormat: PropTypes.func.isRequired,
  boundSetMenuOpen: PropTypes.func.isRequired,
  boundSetAppConfig: PropTypes.func.isRequired,

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
  spinnerCount: selectSpinnerCount(),
  menuOpen: selectMobileMenuOpen(),
  prisonStaffHubUrl: selectPrisonStaffHubUrl(),
  categorisationUrl: selectCategorisationUrl(),
  omicUrl: selectOmicUrl(),
  supportUrl: selectSupportUrl(),
})

const mapDispatchToProps = dispatch => ({
  boundRetrieveUserMe: () => dispatch(retrieveUserMe()),
  boundSetDeviceFormat: format => dispatch(setDeviceFormat(format)),
  boundSetMenuOpen: flag => dispatch(setMenuOpen(flag)),
  boundSetAppConfig: config => dispatch(setAppConfig(config)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
