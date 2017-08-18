import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import { loadBookingDetails } from 'containers/EliteApiLoader/actions';

import TabNav from 'components/Bookings/Details/tabMenu';
import TabNavMobile from 'components/Bookings/Details/tabMenuMobile';
import NavLink from 'components/NavLink';
import { UpperFlexColumn, ContentWrapper } from 'components/DesktopWrappers';

import { selectDeviceFormat, selectSearchContext } from 'selectors/app';

import AddCaseNoteModal from './AddCaseNoteModal';
import OffenderDetails from './OffenderDetails';
import OffenderDetailsMobile from './OffenderDetails/mobile';
import PhysicalAttributes from './PhysicalAttributes';
import PhysicalAttributesMobile from './PhysicalAttributes/mobile';
import CaseNotes from './CaseNotes';
import Alerts from './Alerts';
import BookingsDetailsHeader from './header';
import BookingsDetailsHeaderMobile from './headerMobile';
import EliteImage from 'containers/EliteContainers/Image';

import {
  // Wrapper,
} from './details.theme';

import { selectCurrentDetailTabId, selectDisplayAddCaseNoteModal,selectShouldShowLargePhoto,selectImageId } from '../selectors';
import { setDetailsTab,hideLargePhoto } from '../actions';

import './index.scss';

const tabData = [
    { tabId: 0, title: 'Offender Details', mobileTitle: 'OFFENDER', component: OffenderDetails, componentMobile: OffenderDetailsMobile },
    { tabId: 1, title: 'Physical Attributes', mobileTitle: 'PHYSICAL', component: PhysicalAttributes, componentMobile: PhysicalAttributesMobile },
    { tabId: 2, title: 'Alerts', mobileTitle: 'ALERTS', component: Alerts, componentMobile: Alerts },
    { tabId: 3, title: 'Case Notes', mobileTitle: 'CASE NOTES', component: CaseNotes, componentMobile: CaseNotes },
];

const DesktopView = React.createClass({
  render(){

    const TabComponent = this.props.TabComponent;

     return(
      <div>
       <ContentWrapper>
         { this.props.searchContext === 'assignments' ?
           <NavLink route="/assignments" key="Assignments" text="< Back to assignments"/> :
           <NavLink route="/results" key="Results" text="< Back to search results"/>
         }
         <BookingsDetailsHeader />
         <TabNav
           tabData={tabData.map((tab) => Object.assign(tab, { action: () => this.props.setTab(tab.tabId) }))}
           activeTabId={this.props.activeTabId}
         />
         <TabComponent />
       </ContentWrapper>
     </div>)
  }
})

const MobileView = React.createClass({

  render(){

    const TabComponentMobile = this.props.TabComponentMobile;

    const ContentView =  ({searchContext}) => (
        <div>
          { this.props.searchContext === 'assignments' ?
          <NavLink route="/assignments" key="Assignments" text="< Back to assignments"/> :
          <NavLink route="/results" key="Results" text="< Back to search results"/>
         }
        <BookingsDetailsHeaderMobile />
        <TabComponentMobile />
      </div>
    )

    return (
      <ContentWrapper>
        <div>

          {this.props.shouldShowLargePhoto ?
            <div className="image-container">
              <EliteImage imageId={this.props.imageId} />
              <button type="button" className="cancel-button" onClick={() => this.props.hidePhoto(this.props.imageId)}>
                Close
              </button>
            </div> :
            <div>
              <ContentView searchContext={this.props.searchContext} />
              <TabNavMobile
              tabData={tabData.map((tab) => Object.assign(tab, { action: () => this.props.setTab(tab.tabId) }))}
              activeTabId={this.props.activeTabId}
              />
            </div>
          }
        </div>

      </ContentWrapper>
    )
  }
})

class Details extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { activeTabId, setTab, deviceFormat, displayAddDetailsModal, searchContext } = this.props;
    const TabComponent = tabData[activeTabId].component;
    const TabComponentMobile = tabData[activeTabId].componentMobile;

    return (
      <div>
        {displayAddDetailsModal ? <AddCaseNoteModal /> : null}
        { deviceFormat === 'desktop' ?
          <DesktopView TabComponent={TabComponent} {...this.props}/> :
          <MobileView TabComponentMobile={TabComponentMobile} {...this.props} />
        }
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
