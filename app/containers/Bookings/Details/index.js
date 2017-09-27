import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import TabNav from 'components/Bookings/Details/tabMenu';
import TabNavMobile from 'components/Bookings/Details/tabMenuMobile';
import NavLink from 'components/NavLink';
import { selectDeviceFormat, selectSearchContext } from 'selectors/app';
import EliteImage from 'containers/EliteContainers/Image';

import { analyticsServiceBuilder } from 'utils/analyticsService';
import OffenderDetails from './OffenderDetails';
import OffenderDetailsMobile from './OffenderDetails/mobile';
import CaseNotes from './CaseNotes';
import Alerts from './Alerts';
import KeyDates from './KeyDates';
import BookingsDetailsHeader from './header';
import { selectCurrentDetailTabId, selectDisplayAddCaseNoteModal, selectShouldShowLargePhoto, selectImageId } from '../selectors';
import { setDetailsTab, hideLargePhoto } from '../actions';
import './index.scss';

const analyticsService = analyticsServiceBuilder();

const tabData = [
    { tabId: 0, title: 'Offender Details', mobileTitle: 'Offender', component: OffenderDetails, componentMobile: OffenderDetailsMobile },
    { tabId: 1, title: 'Alerts', mobileTitle: 'Alerts', component: Alerts, componentMobile: Alerts },
    { tabId: 2, title: 'Case Notes', mobileTitle: 'Case notes', component: CaseNotes, componentMobile: CaseNotes },
    { tabId: 3, title: 'Key dates', mobileTitle: 'Key dates', component: KeyDates, componentMobile: KeyDates },
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

    const TabComponentDesktop = tabData[activeTabId].component;
    const TabComponentMobile = tabData[activeTabId].componentMobile;
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
        { this.props.searchContext === 'assignments' ?
          <NavLink route="/assignments" key="Assignments" text="< Back to assignments" /> :
          <NavLink route="/results" key="Results" text="< Back to search results" />
        }

        <BookingsDetailsHeader />

        {deviceFormat === 'desktop' ?
          <TabNav
            tabData={tabData.map((tab) => Object.assign(tab, { action: () => {
              analyticsService.pageView(`bookings details - ${tab.title}`);
              setTab(tab.tabId);
            } }))}
            activeTabId={activeTabId}
          /> :
          <TabNavMobile
            tabData={tabData.map((tab) => Object.assign(tab, { action: () => {
              analyticsService.pageView(`bookings details - ${tab.title}`);
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
