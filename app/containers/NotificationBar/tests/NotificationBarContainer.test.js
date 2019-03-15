import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'
import dismissStateFactory from '../dismissState'
import getNotification from '../notificationSource'
import NotificationBarContainer from '..'

jest.mock('../notificationSource')
jest.mock('../dismissState')

const notificationBody = {}

const notification = {
  id: 'a',
  revision: 1,
  body: notificationBody,
  type: 'Alert',
  expiryTime: moment().add(1, 'day'),
}

const expiredNotification = {
  id: 'a',
  revision: 1,
  body: notificationBody,
  type: 'Alert',
  expiryTime: moment().subtract(1, 'hour'),
}

const stubGetNotification = theNotification => {
  let resolvePromise
  const promise = new Promise(resolve => {
    resolvePromise = resolve
  })

  getNotification.mockImplementation(() => {
    resolvePromise()
    return Promise.resolve(theNotification)
  })
  return promise
}

const stubDismissedState = () => {
  const alreadyDismissed = jest.fn()
  const rememberDismissed = jest.fn()
  dismissStateFactory.mockImplementation(() => ({
    alreadyDismissed,
    rememberDismissed,
  }))

  return { alreadyDismissed, rememberDismissed }
}

describe('NotificationBarContainer', () => {
  it('Renders', async () => {
    const promise = stubGetNotification(notification)

    const dismissedStubs = stubDismissedState()
    dismissedStubs.alreadyDismissed.mockReturnValue(false)

    const wrapper = shallow(<NotificationBarContainer />)

    // Wait for NotificationBarContainer to fetch content asynchronously...
    await promise

    expect(wrapper.find('NotificationBar').prop('type')).toBe('Alert')
    expect(wrapper.find('RichText').prop('content')).toBe(notificationBody)
    expect(dismissedStubs.alreadyDismissed.mock.calls.length).toBe(1)
    expect(dismissedStubs.alreadyDismissed.mock.calls[0][0]).toBe(notification)
  })

  it('is dismissable', async () => {
    const promise = stubGetNotification(notification)

    const dismissedStubs = stubDismissedState()
    dismissedStubs.alreadyDismissed.mockReturnValue(false)

    const wrapper = shallow(<NotificationBarContainer />)

    // Wait for NotificationBarContainer to fetch content asynchronously...
    await promise

    expect(wrapper.find('NotificationBar').prop('type')).toBe('Alert')
    expect(wrapper.find('RichText').prop('content')).toBe(notificationBody)
    expect(dismissedStubs.rememberDismissed.mock.calls.length).toBe(0)

    wrapper
      .dive()
      .find('Dismiss')
      .simulate('click')

    expect(dismissedStubs.rememberDismissed.mock.calls[0][0]).toBe(notification)

    expect(wrapper.exists('NotificationBar')).toBe(false)
  })

  it('Does not show expired notifications', async () => {
    const promise = stubGetNotification(expiredNotification)

    const dismissedStubs = stubDismissedState()
    dismissedStubs.alreadyDismissed.mockReturnValue(false)

    const wrapper = shallow(<NotificationBarContainer />)

    // Wait for NotificationBarContainer to fetch content asynchronously...
    await promise

    expect(wrapper.exists('NotificationBar')).toBe(false)
  })

  it('Does not show dismissed notifications', async () => {
    const promise = stubGetNotification(notification)

    const dismissedStubs = stubDismissedState()
    dismissedStubs.alreadyDismissed.mockReturnValue(true)

    const wrapper = shallow(<NotificationBarContainer />)

    // Wait for NotificationBarContainer to fetch content asynchronously...
    await promise

    expect(wrapper.exists('NotificationBar')).toBe(false)
  })
})
