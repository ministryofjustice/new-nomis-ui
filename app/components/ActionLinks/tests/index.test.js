import React from 'react'

import { shallow } from 'enzyme'

import ActionLinks, { KeyWorkerAdminLink, MyAllocationsLink, EstablishmentRollCheckLink } from '../index'

describe('Actions component', () => {
  it('should only show the my allocations link when the user is a key worker', () => {
    const wrapper = shallow(
      <ActionLinks
        isKeyWorker
        isKeyWorkerAdmin={false}
        isWhereabouts={false}
        omicUrl=""
        whereaboutsUrl=""
        establishmentRollcheckUrl=""
      />
    )

    expect(wrapper.contains(<MyAllocationsLink />)).toBe(true)
  })

  it('should only show the key worker admin link when the user is a key worker admin', () => {
    const wrapper = shallow(
      <ActionLinks
        isKeyWorker={false}
        isKeyWorkerAdmin
        isWhereabouts={false}
        omicUrl="."
        whereaboutsUrl=""
        establishmentRollcheckUrl=""
      />
    )

    expect(wrapper.contains(<KeyWorkerAdminLink omicUrl="." />)).toBe(true)
  })

  it('should not show anything when the user does not have any applicable roles', () => {
    const wrapper = shallow(
      <ActionLinks
        isKeyWorker={false}
        isKeyWorkerAdmin={false}
        isWhereabouts={false}
        omicUrl=""
        whereaboutsUrl=""
        establishmentRollcheckUrl=""
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
        omicUrl=""
        whereaboutsUrl=""
        establishmentRollcheckUrl="http://test"
      />
    )
    expect(wrapper.contains(<EstablishmentRollCheckLink establishmentRollCheckUrl="http://test" />)).toBe(true)
  })
})
