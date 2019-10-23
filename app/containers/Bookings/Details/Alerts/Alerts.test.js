import React from 'react'
import { shallow } from 'enzyme'
import { List } from 'immutable'
import { Alerts } from '.'

const props = {
  totalResults: 0,
  offenderNo: 'ABC123',
  filter: {
    alertType: '',
    fromDate: '',
    toDate: '',
  },
  pagination: {
    perPage: 20,
    pageNumber: 1,
  },
  alerts: List([]),
  deviceFormat: 'desktop',
  prisonStaffHubUrl: 'http://prisonstaffhub.url/',
  user: {},
  loadAlerts: jest.fn(),
  setPagination: jest.fn(),
  setFilter: jest.fn(),
}

describe('Alerts page/tab', () => {
  describe('create alerts button', () => {
    it('should hide the create alert button by default', () => {
      const wrapper = shallow(<Alerts {...props} />)

      expect(wrapper.find('[data-qa="create-alert-button"]')).toHaveLength(0)
    })

    describe('when the user can update alerts', () => {
      const wrapper = shallow(<Alerts {...props} user={{ canUpdateAlerts: true }} userCanEdit />)
      const createAlertButton = wrapper.find('[data-qa="create-alert-button"]')

      it('should show the create alert button when user has the correct role', () => {
        expect(createAlertButton).toHaveLength(1)
      })

      it('should navigate to the correct create alerts page when clicked', () => {
        window.location.assign = jest.fn()
        createAlertButton.props().onClick()

        expect(window.location.assign).toBeCalledWith(
          `${props.prisonStaffHubUrl}offenders/${props.offenderNo}/create-alert`
        )
      })
    })

    describe('when the user has the role, but cannot edit', () => {
      const wrapper = shallow(<Alerts {...props} user={{ canUpdateAlerts: true }} />)
      const createAlertButton = wrapper.find('[data-qa="create-alert-button"]')

      it('should show the create alert button when user has the correct role', () => {
        expect(createAlertButton).toHaveLength(0)
      })
    })
  })
})
