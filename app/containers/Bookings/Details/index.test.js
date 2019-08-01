import React from 'react'
import { shallow } from 'enzyme'
import { Map, fromJS } from 'immutable'

import TabMenu from '../../../components/Bookings/Details/tabMenu'
import TabMenuMobile from '../../../components/Bookings/Details/tabMenuMobile'

import { Details } from './index'

describe('<Details />', () => {
  const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
  const state = fromJS({ app: { error: '', loaded: true } })
  store.getState.mockReturnValue(state)

  describe('should render differently based on user privileges', () => {
    const detailsProps = {
      match: { params: { offenderNo: 'AB12345C' } },
      offenderDetails: Map({}),
      location: { hash: '', pathname: '', search: '' },
      boundViewDetails: jest.fn(),
      hidePhoto: jest.fn(),
      prisonStaffHubUrl: '',
    }

    describe('set active tab', () => {
      it('should pass active tab down from details to tab menu', () => {
        const wrapper = shallow(
          <Details
            userCanEdit
            {...detailsProps}
            match={{ params: { offenderNo: 'AB12345C', activeTab: 'case-notes' } }}
          />
        )

        const div = wrapper.find(TabMenuMobile)
        expect(div.props().activeTabId).toEqual('case-notes')
      })
    })

    describe('mobile view', () => {
      it('should not render case note tab if user cannot edit', () => {
        const wrapper = shallow(<Details {...detailsProps} />)

        const div = wrapper.find(TabMenuMobile)
        expect(div.props().tabData).toHaveLength(4)
      })
      it('should render case note tab if user can edit', () => {
        const wrapper = shallow(<Details {...detailsProps} userCanEdit />)

        const div = wrapper.find(TabMenuMobile)
        expect(div.props().tabData).toHaveLength(5)
      })
    })
    describe('desktop view', () => {
      it('should not render case note tab if user cannot edit', () => {
        const wrapper = shallow(<Details deviceFormat="desktop" {...detailsProps} />)

        const div = wrapper.find(TabMenu)
        expect(div.props().tabData).toHaveLength(4)
      })
      it('should render case note tab if user can edit', () => {
        const wrapper = shallow(<Details deviceFormat="desktop" {...detailsProps} userCanEdit />)

        const div = wrapper.find(TabMenu)
        expect(div.props().tabData).toHaveLength(5)
      })
    })
  })
})
