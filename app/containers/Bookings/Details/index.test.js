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
        const wrapper = shallow(<Details {...detailsProps} userCanEdit={false} />)

        const div = wrapper.find(TabMenuMobile)
        expect(div.props().tabData).toHaveLength(4)
      })
      it('should render case note tab if user can edit', () => {
        const wrapper = shallow(<Details {...detailsProps} />)

        const div = wrapper.find(TabMenuMobile)
        expect(div.props().tabData).toHaveLength(5)
      })
    })

    describe('desktop view', () => {
      it('should not render case note tab if user cannot edit', () => {
        const wrapper = shallow(<Details deviceFormat="desktop" {...detailsProps} userCanEdit={false} />)

        const div = wrapper.find(TabMenu)
        expect(div.props().tabData).toHaveLength(4)
      })
      it('should render case note tab if user can edit', () => {
        const wrapper = shallow(<Details deviceFormat="desktop" {...detailsProps} />)

        const div = wrapper.find(TabMenu)
        expect(div.props().tabData).toHaveLength(5)
      })
    })
  })

  describe('should render offender retention link', () => {
    const detailsProps = {
      match: { params: { offenderNo: 'AB12345C' } },
      location: { hash: '', pathname: '', search: '' },
      boundViewDetails: jest.fn(),
      hidePhoto: jest.fn(),
      prisonStaffHubUrl: 'http://prisonstaffhub/',
    }

    describe('retention link hidden', () => {
      const propsWithNoRetentionLink = {
        ...detailsProps,
        offenderDetails: Map({}),
        displayRetentionLink: false,
      }

      it('should not be visible', () => {
        const wrapper = shallow(<Details {...propsWithNoRetentionLink} userCanEdit={false} />)

        expect(wrapper.containsMatchingElement(<b>Prevent removal of this offender record: </b>)).toBeFalsy()
      })
    })

    describe('display retention link when configured', () => {
      const propsWithRetentionLink = {
        ...detailsProps,
        displayRetentionLink: true,
      }

      it('should indicate not retained', () => {
        const propsRecordNotRetained = {
          ...propsWithRetentionLink,
          offenderDetails: Map({ offenderRecordRetained: false }),
        }

        const wrapper = shallow(<Details {...propsRecordNotRetained} userCanEdit={false} />)

        expect(
          wrapper.containsMatchingElement(
            <div>
              <b>Prevent removal of this offender record: </b> Not set&nbsp;-&nbsp;
              <a href="http://prisonstaffhub/offenders/AB12345C/retention-reasons">update</a>
            </div>
          )
        ).toBeTruthy()
      })

      it('should indicate retained', () => {
        const propsRecordRetained = {
          ...propsWithRetentionLink,
          offenderDetails: Map({ offenderRecordRetained: true }),
        }

        const wrapper = shallow(<Details {...propsRecordRetained} userCanEdit={false} />)

        expect(
          wrapper.containsMatchingElement(
            <div>
              <b>Prevent removal of this offender record: </b> Yes&nbsp;-&nbsp;
              <a href="http://prisonstaffhub/offenders/AB12345C/retention-reasons">view reasons / update</a>
            </div>
          )
        ).toBeTruthy()
      })
    })
  })

  it('should pass the pathfinderId into the page', () => {
    const props = {
      match: { params: { offenderNo: 'AB12345C' } },
      offenderDetails: Map({ pathfinderId: 1 }),
      location: { hash: '', pathname: '', search: '' },
      boundViewDetails: jest.fn(),
      hidePhoto: jest.fn(),
      prisonStaffHubUrl: '',
    }

    const wrapper = shallow(<Details {...props} />)
    const page = wrapper.find('withRouter(Connect(Page))')
    expect(page.props().pathfinderId).toEqual(1)
  })
})
