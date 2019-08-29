import React from 'react'
import PropTypes from 'prop-types'

import { TabMenuItem, TabWrapper } from './tabMenu.theme'

const TabMenu = ({ tabData, activeTabId }) => (
  <TabWrapper>
    {tabData.map(tab => (
      <TabMenuItem
        key={tab.tabId}
        data-qa={tab.tabId}
        active={tab.tabId === activeTabId}
        onClick={tab.tabId === activeTabId ? null : tab.action}
      >
        {tab.title}
      </TabMenuItem>
    ))}
  </TabWrapper>
)

TabMenu.propTypes = {
  tabData: PropTypes.arrayOf(
    PropTypes.shape({
      action: PropTypes.func.isRequired,
      tabId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTabId: PropTypes.string.isRequired,
}

export default TabMenu
