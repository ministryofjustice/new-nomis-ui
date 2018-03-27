import React from 'react';
import PropTypes from 'prop-types';

import {
  TabWrapper,
  TabMenuItem,
} from './tabMenu.theme';

function TabMenu({ tabData, activeTabId }) {
  return (
    <TabWrapper>
      {tabData.map((tab) => <TabMenuItem key={tab.tabId} active={tab.tabId === activeTabId} onClick={tab.tabId === activeTabId ? null : tab.action}>{tab.title}</TabMenuItem>)}
    </TabWrapper>
  );
}

TabMenu.propTypes = {
  tabData: PropTypes.array.isRequired,
  activeTabId: PropTypes.string.isRequired,
};


export default TabMenu;
