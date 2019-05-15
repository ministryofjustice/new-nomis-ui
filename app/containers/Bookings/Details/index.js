import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import TabNav from '../../../components/Bookings/Details/tabMenu'
import TabNavMobile from '../../../components/Bookings/Details/tabMenuMobile'
import { selectDeviceFormat, selectPrisonStaffHubUrl } from '../../../selectors/app'
import EliteImage from '../../EliteContainers/Image'

import OffenderDetails from './OffenderDetails'
import CaseNotes from './CaseNotes/CaseNotesContainer'
import Alerts from './Alerts'
import KeyDates from './KeyDates'
import QuickLook from './QuickLook'
import BookingsDetailsHeader from './header'
import { selectShouldShowLargePhoto, selectImageId } from '../selectors'
import { hideLargePhoto, viewDetails } from '../actions'
import './index.scss'

import { DETAILS_TABS } from '../constants'
import { Model as offenderDetailsModel } from '../../../helpers/dataMappers/offenderDetails'
import { toFullName } from '../../../utils/stringUtils'
import Page from '../../../components/Page'

const tabData = [
  {
    tabId: DETAILS_TABS.QUICK_LOOK,
    title: 'Quick look',
    mobileTitle: 'Quick look',
    component: QuickLook,
    componentMobile: QuickLook,
  },
  {
    tabId: DETAILS_TABS.OFFENDER_DETAILS,
    title: 'Personal',
    mobileTitle: 'Personal',
    component: OffenderDetails,
    componentMobile: OffenderDetails,
  },
  { tabId: DETAILS_TABS.ALERTS, title: 'Alerts', mobileTitle: 'Alerts', component: Alerts, componentMobile: Alerts },
  {
    tabId: DETAILS_TABS.CASE_NOTES,
    title: 'Case notes',
    mobileTitle: 'Case notes',
    component: CaseNotes,
    componentMobile: CaseNotes,
  },
  {
    tabId: DETAILS_TABS.KEY_DATES,
    title: 'Key dates',
    mobileTitle: 'Key dates',
    component: KeyDates,
    componentMobile: KeyDates,
  },
]

const parseActiveTab = needle => {
  const keys = Object.keys(DETAILS_TABS)
  const haystack = keys.map(key => DETAILS_TABS[key])

  if (haystack.includes(needle)) {
    return needle
  }

  return DETAILS_TABS.QUICK_LOOK
}

class Details extends Component {
  componentDidMount() {
    const {
      boundViewDetails,
      match: {
        params: { activeTab, offenderNo, itemId },
      },
    } = this.props
    const tab = parseActiveTab(activeTab)

    boundViewDetails(offenderNo, tab, itemId)
  }

  render() {
    const {
      deviceFormat,
      imageSrcUrl,
      shouldShowLargePhoto,
      hidePhoto,
      match: {
        params: { activeTab, offenderNo, itemId },
      },
      location,
      boundViewDetails,
      offenderDetails,
      prisonStaffHubUrl,
    } = this.props

    const activeTabId = parseActiveTab(activeTab)
    const ActiveTab = tabData.filter(tab => tab.tabId === activeTabId)[0]
    const TabComponentDesktop = ActiveTab.component
    const TabComponentMobile = ActiveTab.componentMobile
    const TabComponent = deviceFormat === 'desktop' ? TabComponentDesktop : TabComponentMobile

    if (shouldShowLargePhoto) {
      return (
        <div className="large-image-container">
          <div className="image-container">
            <EliteImage src={imageSrcUrl} />
          </div>
          <div className="button-container">
            <button type="button" className="cancel-button" onClick={() => hidePhoto(imageSrcUrl)}>
              Close
            </button>
          </div>
        </div>
      )
    }

    const offenderName = toFullName({
      firstName: offenderDetails.get('firstName'),
      lastName: offenderDetails.get('lastName'),
    })
    const isIndividualCaseNote = activeTab === 'case-notes' && itemId

    return (
      <Page title={offenderName} docTitle={isIndividualCaseNote ? 'View case note' : ActiveTab.title}>
        <div className="detail-content">
          <BookingsDetailsHeader offenderNo={offenderNo} prisonStaffHubUrl={prisonStaffHubUrl} />

          {deviceFormat === 'desktop' ? (
            <TabNav
              tabData={tabData.map(tab =>
                Object.assign(tab, {
                  action: () => {
                    boundViewDetails(offenderNo, tab.tabId, itemId)
                  },
                })
              )}
              activeTabId={activeTabId}
            />
          ) : (
            <TabNavMobile
              tabData={tabData.map(tab =>
                Object.assign(tab, {
                  action: () => {
                    boundViewDetails(offenderNo, tab.tabId, itemId)
                  },
                })
              )}
              activeTabId={activeTabId}
            />
          )}
          <TabComponent location={location} offenderNo={offenderNo} itemId={itemId} />
        </div>
      </Page>
    )
  }
}

Details.propTypes = {
  // mapStateToProps
  deviceFormat: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      activeTab: PropTypes.string,
      offenderNo: PropTypes.string,
      itemId: PropTypes.string,
    }),
  }).isRequired,
  imageSrcUrl: PropTypes.number,
  shouldShowLargePhoto: PropTypes.bool,
  prisonStaffHubUrl: PropTypes.string.isRequired,
  offenderDetails: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,

  // mapDispatchToProps
  boundViewDetails: PropTypes.func.isRequired,
  hidePhoto: PropTypes.func.isRequired,

  // special
  location: ReactRouterPropTypes.location.isRequired,
}

Details.defaultProps = {
  deviceFormat: '',
  shouldShowLargePhoto: false,
  imageSrcUrl: null,
}

const mapDispatchToProps = dispatch => ({
  boundViewDetails: (offenderNo, activeTabId, itemId) => dispatch(viewDetails(offenderNo, activeTabId, itemId)),
  hidePhoto: imageSrcUrl => dispatch(hideLargePhoto(imageSrcUrl)),
})

const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
  activeTabId: (state, props) => props.match.params.activeTab,
  shouldShowLargePhoto: selectShouldShowLargePhoto(),
  prisonStaffHubUrl: selectPrisonStaffHubUrl(),
  imageSrcUrl: selectImageId(),
  offenderDetails: (state, props) =>
    state.getIn(['eliteApiLoader', 'Bookings', 'Details', props.match.params.offenderNo, 'Data']) ||
    offenderDetailsModel,
})

// Wrap the component to inject dispatch and state into it
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Details)
