import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import { loadBookingDetails } from 'containers/EliteApiLoader/actions';

import TabNav from 'components/Bookings/Details/tabMenu';
import TabNavMobile from 'components/Bookings/Details/tabMenuMobile';
import { UpperFlexColumn } from 'components/DesktopWrappers';

import { selectDeviceFormat } from 'selectors/app';

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
import { setDetailsTab, openAddCaseNoteModal } from '../actions';

const tabData = [
    { tabId: 0, title: 'Offender Details', mobileTitle: 'OFFENDER', component: OffenderDetails, componentMobile: OffenderDetailsMobile },
    { tabId: 1, title: 'Physical Attributes', mobileTitle: 'PHYSICAL', component: PhysicalAttributes, componentMobile: PhysicalAttributesMobile },
    { tabId: 2, title: 'Alerts', mobileTitle: 'ALERTS', component: Alerts, componentMobile: Alerts },
    { tabId: 3, title: 'Case Notes', mobileTitle: 'CASE NOTES', component: CaseNotes, componentMobile: CaseNotes },
];

class Details extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { activeTabId, setTab, deviceFormat, displayAddDetailsModal } = this.props;
    // console.log(details.toJS());
    // console.log('TabNavMobile', TabNavMobile, deviceFormat);
    const TabComponent = tabData[activeTabId].component;
    const TabComponentMobile = tabData[activeTabId].componentMobile;
    return (
      <div>
        {displayAddDetailsModal ? <AddCaseNoteModal /> : null}
        { deviceFormat === 'desktop' ?
          <div>
            <UpperFlexColumn>
              <BookingsDetailsHeader />
              <TabNav
                tabData={tabData.map((tab) => Object.assign(tab, { action: () => setTab(tab.tabId) }))}
                activeTabId={activeTabId}
              />
              <TabComponent />
            </UpperFlexColumn>
          </div> :
          <div>
            <UpperFlexColumn>
              <BookingsDetailsHeaderMobile tabData={Object.assign(tabData[3], { action: () => setTab(tabData[3].tabId) })} />
              <TabComponentMobile />
            </UpperFlexColumn>
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
  // tabInfo: PropTypes.array.isRequired,
  setTab: PropTypes.func.isRequired,
  // loadBookingDetails: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    // loadBookingDetails: (id) => dispatch(loadBookingDetails(id)),
    setTab: (id) => dispatch(setDetailsTab(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
  activeTabId: selectCurrentDetailTabId(),
  displayAddDetailsModal: selectDisplayAddCaseNoteModal(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Details);
