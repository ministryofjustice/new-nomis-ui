import React from 'react'
import PropTypes from 'prop-types'

import { TabMenuItem, TabWrapper, TabWrapperContentPadding, TextHolder } from './tabMenuMobile.theme'

const TabMenuMobile = ({ tabData, activeTabId }) => {
  const imgArray = [
    '/img/personal_icon.svg',
    '/img/QuickLook_icon.svg',
    '/img/Alerts_icon.svg',
    '/img/CaseNotes_icon.svg',
    '/img/KeyDates_icon.svg',
  ]

  return (
    <div>
      <TabWrapper data-name="TabNavMobile">
        {tabData.map((tab, i) => (
          <TabMenuItem
            key={tab.tabId}
            data-qa={tab.tabId}
            active={tab.tabId === activeTabId}
            onClick={tab.tabId === activeTabId ? null : tab.action}
            bgImg={imgArray[i]}
          >
            <TextHolder>{tab.mobileTitle}</TextHolder>
          </TabMenuItem>
        ))}
      </TabWrapper>
      <TabWrapperContentPadding />
    </div>
  )
}

TabMenuMobile.propTypes = {
  tabData: PropTypes.arrayOf(
    PropTypes.shape({
      action: PropTypes.func.isRequired,
      tabId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTabId: PropTypes.string.isRequired,
}

export default TabMenuMobile
