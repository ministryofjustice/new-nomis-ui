import React from 'react'
import { mount } from 'enzyme'
import { List, Map } from 'immutable'
import { IntlProvider } from 'react-intl'
import AlertList from '.'

const props = {
  alerts: List([
    Map({
      addedByFirstName: 'TEST',
      expired: false,
      active: false,
      alertTypeDescription: 'Child Communication Measures',
      dateExpires: '2019-09-03',
      alertCode: 'CC3',
      alertCodeDescription: 'Child contact description',
      alertType: 'C',
      alertId: 1,
      addedByLastName: 'USER',
      dateCreated: '2019-09-03',
      comment: 'created alert',
    }),
    Map({
      addedByFirstName: 'TEST',
      expired: true,
      active: false,
      alertTypeDescription: 'Violent',
      dateExpires: '2019-09-04',
      alertCode: 'CC3',
      alertCodeDescription: 'Violent description',
      alertType: 'C',
      alertId: 2,
      addedByLastName: 'USER',
      dateCreated: '2019-09-03',
      comment: 'created alert',
    }),
  ]),
  prisonStaffHubUrl: 'http://prisonstaffhub.url/',
  offenderNo: 'ABC123',
}

describe('<AlertList />', () => {
  describe('close alert alerts button', () => {
    describe('on mobile', () => {
      const wrapper = mount(
        <IntlProvider locale="en">
          <AlertList {...props} canUpdateAlerts deviceFormat="mobile" />
        </IntlProvider>
      )

      it('should not show the close alert button', () => {
        expect(wrapper.find('ButtonCancel[data-qa="close-alert-button"]')).toHaveLength(0)
      })
    })

    describe('on desktop', () => {
      const deviceFormat = 'desktop'

      describe('when a user CANNOT update alerts', () => {
        const wrapper = mount(
          <IntlProvider locale="en">
            <AlertList {...props} deviceFormat={deviceFormat} />
          </IntlProvider>
        )

        it('should not show the close alert button', () => {
          expect(wrapper.find('ButtonCancel[data-qa="close-alert-button"]')).toHaveLength(0)
        })
      })

      describe('when a user CAN update alerts', () => {
        const wrapper = mount(
          <IntlProvider locale="en">
            <AlertList {...props} deviceFormat={deviceFormat} canUpdateAlerts />
          </IntlProvider>
        )

        const closeAlertButtons = wrapper.find('ButtonCancel[data-qa="close-alert-button"]')

        it('should show the close alert button', () => {
          expect(closeAlertButtons).toHaveLength(1)
        })

        describe('clicking the button', () => {
          it('should navigate to the correct url ', () => {
            window.location.assign = jest.fn()
            closeAlertButtons.props().onClick()

            expect(window.location.assign).toBeCalledWith(
              `${props.prisonStaffHubUrl}close-alert?offenderNo=${props.offenderNo}&alertId=1`
            )
          })
        })
      })
    })
  })
})
