import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { param } from 'change-case';

import TabNav from 'components/Bookings/Details/tabMenu';
import TabNavMobile from 'components/Bookings/Details/tabMenuMobile';
import { Link } from 'react-router';
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
import { setDetailsTab, hideLargePhoto, viewDetails } from '../actions';
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

class Details extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  async componentDidMount() {
    const { activeTab, bookingId } = this.props.params;
    this.props.viewDetails(bookingId, activeTab || DETAILS_TABS.OFFENDER_DETAILS);
  }

  render() {
    const {
      setTab,
      deviceFormat,
      imageId,
      shouldShowLargePhoto,
      hidePhoto,
      params,
    } = this.props;

    const activeTab = params.activeTab;

    const activeTabId = activeTab || DETAILS_TABS.OFFENDER_DETAILS;
    const bookingId = Number(params.bookingId);
    const itemId = params.itemId;
    const viewMode = params.viewMode;
    const ActiveTab = tabData.filter(tab => tab.tabId === activeTabId)[0];
    const TabComponentDesktop = ActiveTab.component;
    const TabComponentMobile = ActiveTab.componentMobile;
    const TabComponent = deviceFormat === 'desktop' ? TabComponentDesktop : TabComponentMobile;

    if (shouldShowLargePhoto) {
      return (
        <div className="large-image-container">
          <div className="image-container">
            <EliteImage imageId={imageId} />
          </div>
          <div className="button-container">
            <button type="button" className="cancel-button" onClick={() => hidePhoto(imageId)}>Close</button>
          </div>
        </div>
      );
    }

    return (

      <div className="detail-content">

        <BookingsDetailsHeader bookingId={bookingId} />

        {deviceFormat === 'desktop' ?
          <TabNav
            tabData={tabData.map((tab) => Object.assign(tab, { action: () => {
              analyticsService.pageView(`offender details - ${tab.title}`);
              this.props.viewDetails(bookingId, tab.tabId);
            } }))}
            activeTabId={activeTabId}
          /> :
          <TabNavMobile
            tabData={tabData.map((tab) => Object.assign(tab, { action: () => {
              analyticsService.pageView(`offender details - ${tab.title}`);
              this.props.viewDetails(bookingId, tab.tabId);
            } }))}
            activeTabId={activeTabId}
          />}
        <TabComponent bookingId={bookingId} itemId={itemId} />
      </div>
    );
  }
}

Details.propTypes = {
  deviceFormat: PropTypes.string.isRequired,
  // activeTabId: PropTypes.number.isRequired,
  setTab: PropTypes.func.isRequired,
};

Details.defaultProps = {
  deviceFormat: '',
  activeTabId: '',
  setTab: () => {},
};

export function mapDispatchToProps(dispatch) {
  return {
    viewDetails: (bookingId, activeTabId) => dispatch(viewDetails(bookingId, activeTabId)),
    setTab: (id, bookingId) => dispatch(setDetailsTab(id, bookingId)),
    hidePhoto: (imageId) => dispatch(hideLargePhoto(imageId)),
  };
}
// selectShouldShowCarouselForMobile
const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
  activeTabId: selectCurrentDetailTabId(),
  displayAddDetailsModal: selectDisplayAddCaseNoteModal(),
  searchContext: selectSearchContext(),
  shouldShowLargePhoto: selectShouldShowLargePhoto(),
  imageId: selectImageId(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Details);
