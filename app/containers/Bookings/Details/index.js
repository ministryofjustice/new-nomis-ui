import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'

import TabNav from '../../../components/Bookings/Details/tabMenu'
import TabNavMobile from '../../../components/Bookings/Details/tabMenuMobile'
import EliteImage from '../../EliteContainers/Image'

import OffenderDetails from './OffenderDetails'
import CaseNotes from './CaseNotes/CaseNotesContainer'
import Alerts from './Alerts'
import KeyDates from './KeyDates'
import QuickLook from './QuickLook'
import BookingsDetailsHeader from './header'
import { hideLargePhoto, viewDetails } from '../actions'
import './index.scss'

import { DETAILS_TABS } from '../constants'
import { Model as offenderDetailsModel } from '../../../helpers/dataMappers/offenderDetails'
import { toFullName } from '../../../utils/stringUtils'
import { getQueryParams } from '../../../helpers'
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
      userCanEdit,
      displayRetentionLink,
    } = this.props

    const activeTabId = parseActiveTab(activeTab)
    const ActiveTab = tabData.find(tab => tab.tabId === activeTabId)
    const TabComponentDesktop = ActiveTab.component
    const TabComponentMobile = ActiveTab.componentMobile
    const TabComponent = deviceFormat === 'desktop' ? TabComponentDesktop : TabComponentMobile

    if (shouldShowLargePhoto) {
      return (
        <div className="large-image-container">
          <EliteImage className="large-image-container__image" src={imageSrcUrl} />
          <div>
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
    const isIndividualCaseNote = activeTab === DETAILS_TABS.CASE_NOTES && itemId

    return (
      <Page title={offenderName} docTitle={isIndividualCaseNote ? 'View case note' : ActiveTab.title}>
        <div className="detail-content">
          <BookingsDetailsHeader offenderNo={offenderNo} prisonStaffHubUrl={prisonStaffHubUrl} />

          {deviceFormat === 'desktop' ? (
            <TabNav
              tabData={tabData
                .filter(tab => userCanEdit || tab.tabId !== DETAILS_TABS.CASE_NOTES)
                .map(tab =>
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
              tabData={tabData
                .filter(tab => userCanEdit || tab.tabId !== DETAILS_TABS.CASE_NOTES)
                .map(tab =>
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
        {displayRetentionLink && (
          <div className="offender-record-retention font-xsmall">
            <div>
              <b>Prevent removal of this offender record: </b>
              {offenderDetails.get('offenderRecordRetained') ? 'Yes' : 'Not set'}
              &nbsp;-&nbsp;
              <a className="link retention-link" href={`${prisonStaffHubUrl}offenders/${offenderNo}/retention-reasons`}>
                {offenderDetails.get('offenderRecordRetained') ? 'view reasons / update' : 'update'}
              </a>
            </div>
          </div>
        )}
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
  displayRetentionLink: PropTypes.bool,
  offenderDetails: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  userCanEdit: PropTypes.bool,

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
  userCanEdit: true,
  displayRetentionLink: false,
}

const mapDispatchToProps = (dispatch, props) => {
  const { appointmentAdded } = getQueryParams(props.location.search)

  return {
    boundViewDetails: (offenderNo, activeTabId, itemId) =>
      dispatch(viewDetails(offenderNo, activeTabId, itemId, appointmentAdded)),
    hidePhoto: imageSrcUrl => dispatch(hideLargePhoto(imageSrcUrl)),
  }
}

const mapStateToProps = (state, props) => ({
  deviceFormat: state.getIn(['app', 'deviceFormat']),
  activeTabId: props.match.params.activeTab,
  shouldShowLargePhoto: state.getIn(['search', 'details', 'shouldShowLargePhoto']),
  prisonStaffHubUrl: state.getIn(['app', 'prisonStaffHubUrl']),
  dataComplianceUrl: state.getIn(['app', 'dataComplianceUrl']),
  displayRetentionLink: state.getIn(['app', 'displayRetentionLink']),
  imageSrcUrl: state.getIn(['search', 'details', 'imageId']),
  offenderDetails:
    state.getIn(['eliteApiLoader', 'Bookings', 'Details', props.match.params.offenderNo, 'Data']) ||
    offenderDetailsModel,
  userCanEdit: state.getIn(['eliteApiLoader', 'Bookings', 'Details', props.match.params.offenderNo, 'UserCanEdit']),
})

export { Details }

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Details)
