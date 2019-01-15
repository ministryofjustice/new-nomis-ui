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
        adminUtilitiesUrl=""
      />
    )

    expect(wrapper.find('ExternalActionLink').prop('url')).toBe('//omicURL')
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
        adminUtilitiesUrl=""
      />
    )

    expect(wrapper.find('div').children().length).toBe(0)
  })

  it('should show roll check link when the establishmentRollcheckUrl is configured', () => {
    const wrapper = shallow(
      <ActionLinks
        isKeyWorker={false}
        isKeyWorkerAdmin={false}
        isWhereabouts={false}
        hasAdminRights={false}
        omicUrl=""
        whereaboutsUrl=""
        establishmentRollcheckUrl="http://establishmentRollCheckURL"
        adminUtilitiesUrl=""
      />
    )

    expect(wrapper.find('ExternalActionLink').prop('url')).toBe('http://establishmentRollCheckURL')
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
        adminUtilitiesUrl="http://omicurl/admin-utilities"
      />
    )

    expect(wrapper.find('ExternalActionLink').prop('url')).toBe('http://omicurl/admin-utilities')
  })
})
