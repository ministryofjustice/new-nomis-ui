import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

import Header, { Alerts } from './header'

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

const inmate = (alerts, categoryCode) =>
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
    categoryCode,
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
        inmateData={inmate(allAlerts, 'D')}
        onImageClick={jest.fn()}
        offenderNo="A1234RT"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
      />
    )

    expect(wrapper.find('div.align-alerts span')).toHaveLength(4)
    expect(wrapper).toMatchSnapshot()
  })

  it('should ignore irrelevant alert flags', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(irrelevantAlerts, 'D')}
        onImageClick={jest.fn()}
        offenderNo="A1234RE"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
      />
    )

    expect(wrapper.find('div.align-alerts AlertFlag')).toHaveLength(0)
  })

  it('should render MiddleSection correctly large', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(allAlerts, 'D')}
        onImageClick={jest.fn()}
        offenderNo="A1234RE"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
      />
    )

    expect(wrapper.find('div.visible-large > MiddleSection').shallow()).toMatchSnapshot()
  })

  it('should render MiddleSection correctly small', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(allAlerts, 'D')}
        onImageClick={jest.fn()}
        offenderNo="A1234RN"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
      />
    )

    expect(wrapper.find('div.visible-small > MiddleSection').shallow()).toMatchSnapshot()
  })

  it('should render cat A correctly', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(irrelevantAlerts, 'A')}
        onImageClick={jest.fn()}
        offenderNo="A1234RN"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
      />
    )
    const middleSection = wrapper.find('div.visible-large > MiddleSection').shallow()
    expect(
      middleSection
        .find('span.cata-status')
        .first()
        .text()
    ).toEqual('CAT A')
  })

  it('should render cat A High correctly', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(irrelevantAlerts, 'H')}
        onImageClick={jest.fn()}
        offenderNo="A1234RN"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
      />
    )
    const middleSection = wrapper.find('div.visible-large > MiddleSection').shallow()
    const actual = middleSection.find('span.cata-high-status').last()
    expect(actual.text()).toEqual('CAT A High')
  })

  it('should render cat A Prov correctly', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(irrelevantAlerts, 'P')}
        onImageClick={jest.fn()}
        offenderNo="A1234RN"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
      />
    )
    const middleSection = wrapper.find('div.visible-large > MiddleSection').shallow()
    expect(
      middleSection
        .find('span.cata-prov-status')
        .first()
        .text()
    ).toEqual('CAT A Prov')
  })

  it('should show the Add KW Session link', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(allAlerts, 'D')}
        onImageClick={jest.fn()}
        offenderNo="A1234RN"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink
      />
    )

    expect(wrapper.find('div.visible-small > MiddleSection').shallow()).toMatchSnapshot()
  })

  describe('<Alerts /> child component', () => {
    it('should link to to the alerts page and ID', () => {
      const wrapper = shallow(<Alerts activeAlertCount={10} inactiveAlertCount={1} offenderNo="A1234RT" />)

      expect(wrapper.prop('to')).toBe('/offenders/A1234RT/alerts#tab-content')
    })
  })
})
