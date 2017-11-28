import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
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
import { setDetailsTab, hideLargePhoto } from '../actions';
import './index.scss';

import {
  DETAILS_TABS,
} from '../constants';

const analyticsService = analyticsServiceBuilder();

const tabData = [
  { tabId: DETAILS_TABS.OFFENDER_DETAILS, title: 'Offender details', mobileTitle: 'Offender', component: OffenderDetails, componentMobile: OffenderDetails },
  { tabId: DETAILS_TABS.QUICK_LOOK, title: 'Quick look', mobileTitle: 'Quick look', component: QuickLook, componentMobile: QuickLook },
  { tabId: DETAILS_TABS.ALERTS, title: 'Alerts', mobileTitle: 'Alerts', component: Alerts, componentMobile: Alerts },
  { tabId: DETAILS_TABS.CASE_NOTES, title: 'Case notes', mobileTitle: 'Case notes', component: CaseNotes, componentMobile: CaseNotes },
  { tabId: DETAILS_TABS.KEY_DATES, title: 'Key dates', mobileTitle: 'Key dates', component: KeyDates, componentMobile: KeyDates },
];

class Details extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
      activeTabId,
      setTab,
      deviceFormat,
      imageId,
      shouldShowLargePhoto,
      hidePhoto,
    } = this.props;

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

      <div className="detail-content add-gutter-top-lg-down">
        { this.props.searchContext === 'assignments' ?
          <Link className="link" to="/assignments" key="Assignments"> {'<'} Back to assignments </Link> :
          <Link className="link" to="/results" key="Results"> {'<'} Back to search results </Link>
        }

        <BookingsDetailsHeader />

        {deviceFormat === 'desktop' ?
          <TabNav
            tabData={tabData.map((tab) => Object.assign(tab, { action: () => {
              analyticsService.pageView(`offender details - ${tab.title}`);
              setTab(tab.tabId);
            } }))}
            activeTabId={activeTabId}
          /> :
          <TabNavMobile
            tabData={tabData.map((tab) => Object.assign(tab, { action: () => {
              analyticsService.pageView(`offender details - ${tab.title}`);
              setTab(tab.tabId);
            } }))}
            activeTabId={activeTabId}
          />}
        <TabComponent />
      </div>
    );
  }
}

Details.propTypes = {
  deviceFormat: PropTypes.string.isRequired,
  activeTabId: PropTypes.number.isRequired,
  setTab: PropTypes.func.isRequired,
  searchContext: PropTypes.string.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    setTab: (id) => dispatch(setDetailsTab(id)),
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
