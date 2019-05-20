import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

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

const inmate = (alerts, categoryInfo) =>
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
    categoryCode: categoryInfo,
    category: `Cat ${categoryInfo}`,
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
  const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
  store.getState.mockReturnValue(Map())

  it('should render correctly when iep linktoggle enabled', () => {
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <Header
              inmateData={inmate(allAlerts, 'D')}
              onImageClick={jest.fn()}
              offenderNo="A1234RT"
              onAlertFlagClick={jest.fn()}
              showAddKeyworkerSessionLink={false}
              prisonStaffHubUrl="http://prisonstaffhub"
              iepLinkEnabled
            />
          </MemoryRouter>
        </Provider>
      )
      .toJSON()

    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly when iep link toggle disabled', () => {
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <Header
              inmateData={inmate(allAlerts, 'D')}
              onImageClick={jest.fn()}
              offenderNo="A1234RT"
              onAlertFlagClick={jest.fn()}
              showAddKeyworkerSessionLink={false}
              iepLinkEnabled={false}
            />
          </MemoryRouter>
        </Provider>
      )
      .toJSON()

    expect(wrapper).toMatchSnapshot()
  })

  it('should render four alerts', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(allAlerts, 'D')}
        onImageClick={jest.fn()}
        offenderNo="A1234RT"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
        prisonStaffHubUrl="http://prisonstaffhub"
      />
    )

    expect(wrapper.find('div.align-alerts span')).toHaveLength(4)
  })

  it('should ignore irrelevant alert flags', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(irrelevantAlerts, 'D')}
        onImageClick={jest.fn()}
        offenderNo="A1234RE"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
        prisonStaffHubUrl="http://prisonstaffhub"
      />
    )

    expect(wrapper.find('div.align-alerts AlertFlag')).toHaveLength(0)
  })

  it('should render cat A correctly', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(irrelevantAlerts, 'A')}
        onImageClick={jest.fn()}
        offenderNo="A1234RN"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
        prisonStaffHubUrl="http://prisonstaffhub"
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
        prisonStaffHubUrl="http://prisonstaffhub"
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
        prisonStaffHubUrl="http://prisonstaffhub"
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

  describe('<Alerts /> child component', () => {
    it('should link to to the alerts page and ID', () => {
      const wrapper = shallow(<Alerts activeAlertCount={10} inactiveAlertCount={1} offenderNo="A1234RT" />)

      expect(wrapper.prop('to')).toBe('/offenders/A1234RT/alerts#tab-content')
    })
  })
})
