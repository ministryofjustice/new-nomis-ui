import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import TabNav from 'components/Bookings/Details/tabMenu';
import TabNavMobile from 'components/Bookings/Details/tabMenuMobile';
import { selectDeviceFormat, selectSearchContext } from 'selectors/app';
import EliteImage from 'containers/EliteContainers/Image';

import { analyticsServiceBuilder } from 'utils/analyticsService';
import OffenderDetails from './OffenderDetails';
import CaseNotes from './CaseNotes';
import Alerts from './Alerts';
import KeyDates from './KeyDates';
import QuickLook from './QuickLook';
import BookingsDetailsHeader from './header';
import { selectCurrentDetailTabId, selectDisplayAddCaseNoteModal, selectShouldShowLargePhoto, selectImageId } from '../selectors';
import { hideLargePhoto, viewDetails } from '../actions';
import './index.scss';

import {
  DETAILS_TABS,
} from '../constants';

const analyticsService = analyticsServiceBuilder();

const tabData = [
  { tabId: DETAILS_TABS.OFFENDER_DETAILS, title: 'Personal', mobileTitle: 'Personal', component: OffenderDetails, componentMobile: OffenderDetails },
  { tabId: DETAILS_TABS.QUICK_LOOK, title: 'Quick look', mobileTitle: 'Quick look', component: QuickLook, componentMobile: QuickLook },
  { tabId: DETAILS_TABS.ALERTS, title: 'Alerts', mobileTitle: 'Alerts', component: Alerts, componentMobile: Alerts },
  { tabId: DETAILS_TABS.CASE_NOTES, title: 'Case notes', mobileTitle: 'Case notes', component: CaseNotes, componentMobile: CaseNotes },
  { tabId: DETAILS_TABS.KEY_DATES, title: 'Key dates', mobileTitle: 'Key dates', component: KeyDates, componentMobile: KeyDates },
];

const parseActiveTab = (needle) => {
  const keys = Object.keys(DETAILS_TABS);
  const haystack = keys.map(key => DETAILS_TABS[key]);

  if (haystack.includes(needle)) {
    return needle;
  }

  return DETAILS_TABS.OFFENDER_DETAILS;
}

class Details extends Component {
  componentDidMount() {
    const { activeTab, offenderNo } = this.props.params;
    const tab = parseActiveTab(activeTab);

    this.props.viewDetails(offenderNo, tab);
  }

  render() {
    const {
      deviceFormat,
      imageSrcUrl,
      shouldShowLargePhoto,
      hidePhoto,
      params,
      location,
    } = this.props;

    const activeTabId = parseActiveTab(params.activeTab);
    const offenderNo = params.offenderNo;
    const itemId = params.itemId;
    const ActiveTab = tabData.filter(tab => tab.tabId === activeTabId)[0];
    const TabComponentDesktop = ActiveTab.component;
    const TabComponentMobile = ActiveTab.componentMobile;
    const TabComponent = deviceFormat === 'desktop' ? TabComponentDesktop : TabComponentMobile;

    if (shouldShowLargePhoto) {
      return (
        <div className="large-image-container">
          <div className="image-container">
            <EliteImage src={imageSrcUrl} />
          </div>
          <div className="button-container">
            <button type="button" className="cancel-button" onClick={() => hidePhoto(imageSrcUrl)}>Close</button>
          </div>
        </div>
      );
    }

    return (

      <div className="detail-content">

        <BookingsDetailsHeader offenderNo={offenderNo} />

        {deviceFormat === 'desktop' ?
          <TabNav
            tabData={tabData.map((tab) => Object.assign(tab, { action: () => {
              analyticsService.pageView(`offender details - ${tab.title}`);
              this.props.viewDetails(offenderNo, tab.tabId);
            } }))}
            activeTabId={activeTabId}
          /> :
          <TabNavMobile
            tabData={tabData.map((tab) => Object.assign(tab, { action: () => {
              analyticsService.pageView(`offender details - ${tab.title}`);
              this.props.viewDetails(offenderNo, tab.tabId);
            } }))}
            activeTabId={activeTabId}
          />}
        <TabComponent location={location} offenderNo={offenderNo} itemId={itemId} />
      </div>
    );
  }
}

Details.propTypes = {
  deviceFormat: PropTypes.string.isRequired,
};

Details.defaultProps = {
  deviceFormat: '',
  activeTabId: '',
};

export function mapDispatchToProps(dispatch) {
  return {
    viewDetails: (offenderNo, activeTabId) => dispatch(viewDetails(offenderNo, activeTabId)),
    hidePhoto: (imageSrcUrl) => dispatch(hideLargePhoto(imageSrcUrl)),
  };
}
// selectShouldShowCarouselForMobile
const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
  activeTabId: selectCurrentDetailTabId(),
  displayAddDetailsModal: selectDisplayAddCaseNoteModal(),
  searchContext: selectSearchContext(),
  shouldShowLargePhoto: selectShouldShowLargePhoto(),
  imageSrcUrl: selectImageId(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Details);
