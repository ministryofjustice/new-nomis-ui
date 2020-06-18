import React from 'react'

import { shallow, mount } from 'enzyme'

import ActionLinks from '../index'

describe('Actions component', () => {
  it('should only show the my allocations link when the user is a key worker', () => {
    const wrapper = shallow(<ActionLinks omicUrl="//omicURL" staffId="123" isKeyWorker />)

    expect(wrapper.find('Link').prop('to')).toBe('//omicURLmanage-key-workers/key-worker/123')
  })

  it('should only show the key worker admin link when the user is a key worker admin', () => {
    const wrapper = shallow(<ActionLinks omicUrl="//omicURL" isKeyWorkerAdmin />)

    expect(wrapper.find('ActionLink').prop('url')).toBe('//omicURLmanage-key-workers')
  })

  it('should show admin and utilities link when the user has admin rights', () => {
    const wrapper = shallow(<ActionLinks manageAuthAccountsUrl="http://manage-hmpps-auth" hasAdminRights />)

    expect(wrapper.find('ActionLink').prop('url')).toBe('http://manage-hmpps-auth')
  })
  it('should show add cat tool link when the user has cat tool role', () => {
    const wrapper = shallow(<ActionLinks categorisationUrl="http://cat-tool" isCatToolUser />)

    expect(wrapper.find('ActionLink').prop('url')).toBe('http://cat-tool')
  })
})

it('should show Use of Force link when the user has selected at UoF enabled prison', () => {
  const wrapper = shallow(<ActionLinks isUseOfForce useOfForceUrl="http://use-of-force/" />)

  expect(wrapper.find('ActionLink').prop('url')).toBe('http://use-of-force/')
})

it('should show Pathfinder link when the user has a Pathfinder role', () => {
  const wrapper = shallow(<ActionLinks isPathfinderUser pathfinderUrl="http://pathfinder/" />)

  expect(wrapper.find('ActionLink').prop('url')).toBe('http://pathfinder/')
})

it('should show Licence link when the user has a licence role', () => {
  const wrapper = shallow(<ActionLinks licencesUrl="http://licences/" isLicenceUser />)

  expect(wrapper.find('ActionLink').prop('url')).toBe('http://licences/')
})

it('should show Pom alloc link when the user has a POM Alloc role', () => {
  const wrapper = shallow(<ActionLinks moicUrl="http://moic/" isPomAllocUser />)

  expect(wrapper.find('ActionLink').prop('url')).toBe('http://moic/')
})

it('should show PECS link when the user has a PECS role', () => {
  const wrapper = shallow(<ActionLinks isPecsUser pecsUrl="http://pecs/" />)

  expect(wrapper.find('ActionLink').prop('url')).toBe('http://pecs/')
})

it('should show global search link when the user has isGlobalSearch', () => {
  const wrapper = mount(<ActionLinks prisonStaffHubUrl="http://" isGlobalSearch />)
  expect(wrapper.text()).toMatch('Global search')
})

it('should show roll check link when the user has isEstablishmentRollCheck', () => {
  const wrapper = mount(<ActionLinks prisonStaffHubUrl="http://" isEstablishmentRollCheck />)
  expect(wrapper.text()).toMatch('Establishment roll check')
})

it('should show add bulk appointments link when the user has admin rights', () => {
  const wrapper = mount(<ActionLinks prisonStaffHubUrl="http://" isAddBulkAppointments />)
  expect(wrapper.text()).toMatch('Add bulk appointments')
})

it('should show COVID link if a prison user', () => {
  const wrapper = shallow(<ActionLinks prisonStaffHubUrl="http://" isPrisonUser />)
  expect(wrapper.find('ActionLink').prop('url')).toBe('http://current-covid-units')
})

it('should show not show COVID link if not a prison user', () => {
  const wrapper = shallow(<ActionLinks prisonStaffHubUrl="http://" />)
  expect(wrapper.find('ActionLink').length).toBe(0)
})
