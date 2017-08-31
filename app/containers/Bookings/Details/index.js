import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import TabNav from 'components/Bookings/Details/tabMenu';
import TabNavMobile from 'components/Bookings/Details/tabMenuMobile';
import NavLink from 'components/NavLink';

import { selectDeviceFormat, selectSearchContext } from 'selectors/app';
import OffenderDetails from './OffenderDetails';
import OffenderDetailsMobile from './OffenderDetails/mobile';
import PhysicalAttributes from './PhysicalAttributes';
import PhysicalAttributesMobile from './PhysicalAttributes/mobile';
import CaseNotes from './CaseNotes';
import Alerts from './Alerts';
import BookingsDetailsHeader from './header';
import EliteImage from 'containers/EliteContainers/Image';

import { selectCurrentDetailTabId, selectDisplayAddCaseNoteModal,selectShouldShowLargePhoto,selectImageId } from '../selectors';
import { setDetailsTab,hideLargePhoto } from '../actions';

import './index.scss';

const tabData = [
    { tabId: 0, title: 'Offender Details', mobileTitle: 'OFFENDER', component: OffenderDetails, componentMobile: OffenderDetailsMobile },
    { tabId: 1, title: 'Physical Attributes', mobileTitle: 'PHYSICAL', component: PhysicalAttributes, componentMobile: PhysicalAttributesMobile },
    { tabId: 2, title: 'Alerts', mobileTitle: 'ALERTS', component: Alerts, componentMobile: Alerts },
    { tabId: 3, title: 'Case Notes', mobileTitle: 'CASE NOTES', component: CaseNotes, componentMobile: CaseNotes },
];

class Details extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
      activeTabId,
      setTab,
      deviceFormat,
      searchContext,
      imageId,
      shouldShowLargePhoto,
      hidePhoto,
    } = this.props;

    const TabComponentDesktop = tabData[activeTabId].component;
    const TabComponentMobile = tabData[activeTabId].componentMobile;
    const TabComponent = deviceFormat === 'desktop' ? TabComponentDesktop : TabComponentMobile;


    if (shouldShowLargePhoto) {
      return (
        <div>
          <div className="image-container">
            <EliteImage imageId={imageId} />
          </div>
          <div className="button-container">
            <button type="button" className="cancel-button" onClick={() => hidePhoto(imageId)}>Close</button>
          </div>
        </div>
      )
    }

    return (

      <div className="detail-content">
        { this.props.searchContext === 'assignments' ?
          <NavLink route="/assignments" key="Assignments" text="< Back to assignments"/> :
          <NavLink route="/results" key="Results" text="< Back to search results"/>
        }

        <BookingsDetailsHeader/>

        {deviceFormat === 'desktop' ?
          <TabNav
            tabData={tabData.map((tab) => Object.assign(tab, { action: () => setTab(tab.tabId) }))}
            activeTabId={activeTabId}/>:
          <TabNavMobile
            tabData={tabData.map((tab) => Object.assign(tab, { action: () => setTab(tab.tabId) }))}
            activeTabId={activeTabId}/>}
        <TabComponent />
      </div>
    );
  }
}

Details.propTypes = {
  displayAddDetailsModal: PropTypes.bool.isRequired,
  deviceFormat: PropTypes.string.isRequired,
  activeTabId: PropTypes.number.isRequired,
  setTab: PropTypes.func.isRequired,
  searchContext: PropTypes.string,
};

export function mapDispatchToProps(dispatch) {
  return {
    setTab: (id) => dispatch(setDetailsTab(id)),
    hidePhoto: (imageId) => dispatch(hideLargePhoto(imageId))
  };
}
//selectShouldShowCarouselForMobile
const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
  activeTabId: selectCurrentDetailTabId(),
  displayAddDetailsModal: selectDisplayAddCaseNoteModal(),
  searchContext: selectSearchContext(),
  shouldShowLargePhoto: selectShouldShowLargePhoto(),
  imageId: selectImageId()
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Details);
