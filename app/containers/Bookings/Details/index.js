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


import {
  // Wrapper,
} from './details.theme';

// import { search } from './actions';
import { selectCurrentDetailTabId, selectDisplayAddCaseNoteModal } from '../selectors';
import { setDetailsTab } from '../actions';

const tabData = [
    { tabId: 0, title: 'Offender Details', mobileTitle: 'OFFENDER', component: OffenderDetails, componentMobile: OffenderDetailsMobile },
    { tabId: 1, title: 'Physical Attributes', mobileTitle: 'PHYSICAL', component: PhysicalAttributes, componentMobile: PhysicalAttributesMobile },
    { tabId: 2, title: 'Alerts', mobileTitle: 'ALERTS', component: Alerts, componentMobile: Alerts },
    { tabId: 3, title: 'Case Notes', mobileTitle: 'CASE NOTES', component: CaseNotes, componentMobile: CaseNotes },
];

class Details extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { activeTabId, setTab, deviceFormat, displayAddDetailsModal, searchContext } = this.props;
    // console.log(details.toJS());
    // console.log('TabNavMobile', TabNavMobile, deviceFormat);
    const TabComponent = tabData[activeTabId].component;
    const TabComponentMobile = tabData[activeTabId].componentMobile;
    return (
      <div>
        {displayAddDetailsModal ? <AddCaseNoteModal /> : null}
        { deviceFormat === 'desktop' ?
          <div>
            <ContentWrapper>
              { searchContext === 'assignments' ?
                <NavLink route="/assignments" key="Assignments" text="< Back to assignments"/> :
                <NavLink route="/search/results" key="Results" text="< Back to search results"/>
              }
              <BookingsDetailsHeader />
              <TabNav
                tabData={tabData.map((tab) => Object.assign(tab, { action: () => setTab(tab.tabId) }))}
                activeTabId={activeTabId}
              />
              <TabComponent />
            </ContentWrapper>
          </div> :
          <div>
            <ContentWrapper>
              { searchContext === 'assignments' ?
                <NavLink route="/assignments" key="Assignments" text="< Back to assignments"/> :
                <NavLink route="/search/results" key="Results" text="< Back to search results"/>
              }
              <BookingsDetailsHeaderMobile />
              <TabComponentMobile />
            </ContentWrapper>
            <TabNavMobile
              tabData={tabData.map((tab) => Object.assign(tab, { action: () => setTab(tab.tabId) }))}
              activeTabId={activeTabId}
            />
          </div>
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
  };
}

const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
  activeTabId: selectCurrentDetailTabId(),
  displayAddDetailsModal: selectDisplayAddCaseNoteModal(),
  searchContext: selectSearchContext(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Details);
