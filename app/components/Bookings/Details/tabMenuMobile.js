import React from 'react';
import PropTypes from 'prop-types';

import {
  TabWrapper,
  TabMenuItem,
  TextHolder,
  TabWrapperContentPadding,
} from './tabMenuMobile.theme';

function TabMenuMobile({ tabData, activeTabId }) {
  const imgArray = [
    '/img/tab-menu-mobile-OFFENDER.png',
    '/img/tab-menu-mobile-PHYSICAL.png',
    '/img/tab-menu-mobile-ALERTS.png',
    '/img/tab-menu-mobile-CASENOTES.png',
    '/img/tab-menu-mobile-MORE.png',
  ];

  return (
    <div>
      <TabWrapper data-name={'TabNavMobile'}>
        {tabData.map((tab, i) => <TabMenuItem
          key={tab.tabId}
          active={tab.tabId === activeTabId}
          onClick={tab.tabId === activeTabId ? null : tab.action}
          bgImg={imgArray[i]}
        ><TextHolder>{tab.mobileTitle}</TextHolder></TabMenuItem>)}
      </TabWrapper>
      <TabWrapperContentPadding />
    </div>
  );
}

TabMenuMobile.propTypes = {
  tabData: PropTypes.array.isRequired,
  activeTabId: PropTypes.number.isRequired,
};


export default TabMenuMobile;
//  <img src={imgArray[i]} alt={imgArray[i]} />
//
//  <TabMenuItem
//   active={activeTabId === 4}
//   bgImg={imgArray[4]}
// ><TextHolder>MORE</TextHolder></TabMenuItem>
