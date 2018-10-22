import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

import Header from './header'

const allAlerts = [
  Map({ alertCode: 'HA' }),
  Map({ alertCode: 'XSA' }),
  Map({ alertCode: 'XA' }),
  Map({ alertCode: 'PEEP' }),
]
const irrelevantAlerts = [
  Map({ alertCode: 'HA', expired: true }),
  Map({ alertCode: 'XSA', expired: true }),
  Map({ alertCode: 'XR' }),
  Map({ alertCode: 'TAH' }),
]

const inmate = alerts =>
  Map({
    offenderNo: 'A1234RT',
    firstName: 'First',
    lastName: 'Last',
    facialImageId: -11,
    assignedLivingUnit: Map({ description: 'H-1-001', agencyName: 'HLI' }),
    alerts,
    keyworker: Map({ staffId: -6 }),
    activeAlertCount: 9,
    inactiveAlertCount: 8,
    iepLevel: 'Standard',
    csra: 'Medium',
    category: 'Cat D',
    getState: jest.fn(() =>
      Map({
        authentication: Map({ user: { staffId: 45 } }),
        app: { feedbackUrl: 'url' },
      })
    ),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  })

describe('Header component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(allAlerts)}
        onImageClick={jest.fn()}
        offenderNo="A1234RT"
        onAlertFlagClick={jest.fn()}
      />
    )

    expect(wrapper.find('div.align-alerts AlertFlag')).toHaveLength(4)
    expect(wrapper).toMatchSnapshot()
  })

  it('should ignore irrelevant alert flags', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(irrelevantAlerts)}
        onImageClick={jest.fn()}
        offenderNo="A1234RE"
        onAlertFlagClick={jest.fn()}
      />
    )

    expect(wrapper.find('div.align-alerts AlertFlag')).toHaveLength(0)
  })

  it('should render MiddleSection correctly large', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(allAlerts)}
        onImageClick={jest.fn()}
        offenderNo="A1234RE"
        onAlertFlagClick={jest.fn()}
      />
    )

    expect(wrapper.find('div.visible-large > MiddleSection').shallow()).toMatchSnapshot()
  })

  it('should render MiddleSection correctly small', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(allAlerts)}
        onImageClick={jest.fn()}
        offenderNo="A1234RN"
        onAlertFlagClick={jest.fn()}
      />
    )

    expect(wrapper.find('div.visible-small > MiddleSection').shallow()).toMatchSnapshot()
  })
})
