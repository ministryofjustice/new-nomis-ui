import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import { loadBookingDetails } from 'containers/EliteApiLoader/actions';

import TabNav from 'components/Bookings/Details/tabMenu';


import OffenderDetails from './OffenderDetails';
import PhysicalAttributes from './PhysicalAttributes';
import CaseNotes from './CaseNotes';
import Alerts from './Alerts';
import BookingsDetailsHeader from './header';

import {
  Wrapper,
} from './details.theme';

// import { search } from './actions';
import { selectCurrentDetailTabId } from '../selectors';
import { setDetailsTab } from '../actions';

const tabData = [
    { tabId: 0, title: 'Offender Details', component: OffenderDetails },
    { tabId: 1, title: 'Physical Attributes', component: PhysicalAttributes },
    { tabId: 2, title: 'Alerts', component: Alerts },
    { tabId: 3, title: 'Case Notes', component: CaseNotes },
];

class Details extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  // componentWillMount() {
  // }

  render() {
    const { activeTabId, setTab } = this.props;
    // console.log(details.toJS());
    const TabComponent = tabData[activeTabId].component;
    return (
      <Wrapper>
        <BookingsDetailsHeader />
        <TabNav tabData={tabData.map((tab) => Object.assign(tab, { action: () => setTab(tab.tabId) }))} activeTabId={activeTabId} />
        <TabComponent />
      </Wrapper>
    );
  }
}

Details.propTypes = {
  // details: PropTypes.object.isRequired,
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
  // details: selectBookingDetail(),
  activeTabId: selectCurrentDetailTabId(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Details);
