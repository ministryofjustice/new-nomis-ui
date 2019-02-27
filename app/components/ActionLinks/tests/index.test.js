import React from 'react'

import { shallow } from 'enzyme'

import ActionLinks from '../index'

describe('Actions component', () => {
  it('should only show the my allocations link when the user is a key worker', () => {
    const wrapper = shallow(
      <ActionLinks
        isKeyWorker
        isKeyWorkerAdmin={false}
        isWhereabouts={false}
        hasAdminRights={false}
        omicUrl=""
        whereaboutsUrl=""
        establishmentRollcheckUrl=""
        isEstablishmentRollCheck={false}
        isGlobalSearch={false}
        globalSearchUrl=""
        adminUtilitiesUrl=""
      />
    )

    expect(wrapper.find('Link').prop('to')).toBe('/key-worker-allocations')
  })

  it('should only show the key worker admin link when the user is a key worker admin', () => {
    const wrapper = shallow(
      <ActionLinks
        isKeyWorker={false}
        isKeyWorkerAdmin
        isWhereabouts={false}
        hasAdminRights={false}
        omicUrl="//omicURL"
        whereaboutsUrl=""
        establishmentRollcheckUrl=""
        isEstablishmentRollCheck={false}
        isGlobalSearch={false}
        globalSearchUrl=""
        adminUtilitiesUrl=""
      />
    )

    expect(wrapper.find('ActionLink').prop('url')).toBe('//omicURL')
  })

  it('should not show anything when the user does not have any applicable roles', () => {
    const wrapper = shallow(
      <ActionLinks
        isKeyWorker={false}
        isKeyWorkerAdmin={false}
        isWhereabouts={false}
        hasAdminRights={false}
        omicUrl=""
        whereaboutsUrl=""
        establishmentRollcheckUrl=""
        isEstablishmentRollCheck={false}
        isGlobalSearch={false}
        globalSearchUrl=""
        adminUtilitiesUrl=""
      />
    )

    expect(wrapper.find('div').children().length).toBe(0)
  })

  it('should show global search link when the user has isGlobalSearch', () => {
    const wrapper = shallow(
      <ActionLinks
        isKeyWorker={false}
        isKeyWorkerAdmin={false}
        isWhereabouts={false}
        hasAdminRights={false}
        omicUrl=""
        whereaboutsUrl=""
        establishmentRollcheckUrl=""
        isEstablishmentRollCheck={false}
        globalSearchUrl="http://globalSearchUrl"
        isGlobalSearch
        adminUtilitiesUrl=""
      />
    )

    expect(wrapper.find('ActionLink').prop('url')).toBe('http://globalSearchUrl')
  })

  it('should show roll check link when the user has isEstablishmentRollCheck', () => {
    const wrapper = shallow(
      <ActionLinks
        isKeyWorker={false}
        isKeyWorkerAdmin={false}
        isWhereabouts={false}
        hasAdminRights={false}
        omicUrl=""
        whereaboutsUrl=""
        establishmentRollcheckUrl="http://establishmentRollCheckURL"
        isEstablishmentRollCheck
        isGlobalSearch={false}
        globalSearchUrl=""
        adminUtilitiesUrl=""
      />
    )

    expect(wrapper.find('ActionLink').prop('url')).toBe('http://establishmentRollCheckURL')
  })

  it('should show admin and utilities link when the user has admin rights', () => {
    const wrapper = shallow(
      <ActionLinks
        isKeyWorker={false}
        isKeyWorkerAdmin={false}
        isWhereabouts={false}
        hasAdminRights
        omicUrl=""
        whereaboutsUrl=""
        establishmentRollcheckUrl=""
        isEstablishmentRollCheck={false}
        isGlobalSearch={false}
        globalSearchUrl=""
        adminUtilitiesUrl="http://omicurl/admin-utilities"
      />
    )

    expect(wrapper.find('ActionLink').prop('url')).toBe('http://omicurl/admin-utilities')
  })
})
