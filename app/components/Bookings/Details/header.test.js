import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import Header, { Alerts } from './header'

const allAlerts = [
  Map({ alertCode: 'HA' }),
  Map({ alertCode: 'HA1' }),
  Map({ alertCode: 'XSA' }),
  Map({ alertCode: 'XA' }),
  Map({ alertCode: 'PEEP' }),
  Map({ alertCode: 'XCO' }),
  Map({ alertCode: 'XCA' }),
  Map({ alertCode: 'XCI' }),
  Map({ alertCode: 'XR' }),
  Map({ alertCode: 'RTP' }),
  Map({ alertCode: 'RLG' }),
  Map({ alertCode: 'XHT' }),
  Map({ alertCode: 'XCU' }),
  Map({ alertCode: 'XGANG' }),
  Map({ alertCode: 'CSIP' }),
  Map({ alertCode: 'F1' }),
  Map({ alertCode: 'LCE' }),
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
    bookingId: 100,
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

  it('should render correctly', () => {
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
              categorisationLinkText=""
              categorisationUrl="http://catTool"
              isUseOfForce={false}
              useOfForceUrl="http://useofforce"
              userCanEdit
            />
          </MemoryRouter>
        </Provider>
      )
      .toJSON()

    expect(wrapper).toMatchSnapshot()
  })

  describe('should render differently based on user privileges', () => {
    const headerProps = {
      inmateData: inmate(allAlerts, 'D'),
      onImageClick: jest.fn(),
      offenderNo: 'A1234RT',
      onAlertFlagClick: jest.fn(),
      showAddKeyworkerSessionLink: false,
      prisonStaffHubUrl: 'http://prisonstaffhub',
      categorisationLinkText: '',
      categorisationUrl: 'http://catTool',
      isUseOfForce: false,
      useOfForceUrl: 'http://useofforce',
    }
    it('should render buttons if user can edit', () => {
      const wrapper = shallow(<Header userCanEdit {...headerProps} />)

      const middleSection = wrapper.find('div.visible-large > MiddleSection').shallow()

      expect(middleSection.find('div.stacked-links div')).toHaveLength(2)
    })
    it('should hide buttons if user cannot edit', () => {
      const wrapper = shallow(<Header userCanEdit={false} {...headerProps} />)
      const middleSection = wrapper.find('div.visible-large > MiddleSection').shallow()

      expect(middleSection.find('div.stacked-links div')).toHaveLength(0)
    })
    it('should render iep details link if user can edit', () => {
      const wrapper = shallow(<Header userCanEdit {...headerProps} />)

      const middleSection = wrapper.find('div.visible-large > MiddleSection').shallow()

      expect(middleSection.find("a[data-qa='iep-details-link']")).toHaveLength(2)
    })
    it('should hide iep details link if user cannot edit', () => {
      const wrapper = shallow(<Header userCanEdit={false} {...headerProps} />)
      const middleSection = wrapper.find('div.visible-large > MiddleSection').shallow()

      expect(middleSection.find("a[data-qa='iep-details-link']")).toHaveLength(0)
    })
  })

  it('should render 16 alerts', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(allAlerts, 'D')}
        onImageClick={jest.fn()}
        offenderNo="A1234RT"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
        prisonStaffHubUrl="http://prisonstaffhub"
        categorisationLinkText=""
        categorisationUrl="http://catTool"
        isUseOfForce={false}
        useOfForceUrl="http://useofforce"
        userCanEdit
      />
    )

    // Risk to LGBT is backed by two codes, so even though there are
    // 16 alert codes, only one alert flag will be shown
    expect(wrapper.find('div.align-alerts span')).toHaveLength(16)
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
        categorisationLinkText=""
        categorisationUrl="http://catTool"
        isUseOfForce={false}
        useOfForceUrl="http://useofforce"
        userCanEdit
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
        categorisationLinkText=""
        categorisationUrl="http://catTool"
        isUseOfForce={false}
        useOfForceUrl="http://useofforce"
        userCanEdit
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

  it('should render the Manage category link', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(irrelevantAlerts, 'A')}
        onImageClick={jest.fn()}
        offenderNo="A1234RN"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
        prisonStaffHubUrl="http://prisonstaffhub"
        categorisationLinkText="Manage"
        categorisationUrl="http://catTool/"
        isUseOfForce={false}
        useOfForceUrl="http://useofforce"
        userCanEdit
      />
    )
    const middleSection = wrapper.find('div.visible-large > MiddleSection').shallow()
    expect(
      middleSection
        .find("a[data-qa='categorisation-external-link']")
        .first()
        .text()
    ).toEqual('Manage')
    const middleSectionMobile = wrapper.find('div.visible-small > MiddleSection').shallow()
    expect(
      middleSectionMobile
        .find("a[data-qa='categorisation-external-link']")
        .first()
        .text()
    ).toEqual('Manage')
  })

  it('should render the category even when no cat', () => {
    const wrapper = shallow(
      <Header
        inmateData={inmate(irrelevantAlerts, null)}
        onImageClick={jest.fn()}
        offenderNo="A1234RN"
        onAlertFlagClick={jest.fn()}
        showAddKeyworkerSessionLink={false}
        prisonStaffHubUrl="http://prisonstaffhub"
        categorisationLinkText="Manage"
        categorisationUrl="http://catTool/"
        isUseOfForce={false}
        useOfForceUrl="http://useofforce"
        userCanEdit
      />
    )
    const middleSection = wrapper.find('div.visible-large > MiddleSection').shallow()
    expect(middleSection.find("div[data-qa='category'] > strong").text()).toEqual('--')
    expect(middleSection.find("div[data-qa='category'] > div> a").getElement().props.href).toEqual('http://catTool/100')

    const middleSectionMobile = wrapper.find('div.visible-small > MiddleSection').shallow()
    expect(middleSectionMobile.find("div[data-qa='category'] > strong").text()).toEqual('--')
    expect(middleSectionMobile.find("div[data-qa='category'] > div > a").getElement().props.href).toEqual(
      'http://catTool/100'
    )
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
        categorisationLinkText=""
        categorisationUrl="http://catTool"
        isUseOfForce={false}
        useOfForceUrl="http://useofforce"
        userCanEdit
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
        categorisationLinkText=""
        categorisationUrl="http://catTool"
        isUseOfForce={false}
        useOfForceUrl="http://useofforce"
        userCanEdit
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

  describe('should not render link for Report use of force if user caseload IS NOT UoF enabled prison', () => {
    const headerProps = {
      inmateData: inmate(allAlerts, 'D'),
      onImageClick: jest.fn(),
      offenderNo: 'A1234RT',
      onAlertFlagClick: jest.fn(),
      showAddKeyworkerSessionLink: false,
      prisonStaffHubUrl: 'http://prisonstaffhub',
      categorisationLinkText: '',
      categorisationUrl: 'http://catTool',
      isUseOfForce: false,
      useOfForceUrl: 'http://useofforce',
    }
    it('should render buttons if user can edit', () => {
      const wrapper = shallow(<Header userCanEdit {...headerProps} />)
      const middleSection = wrapper.find('div.visible-large > MiddleSection').shallow()

      expect(middleSection.find('div.stacked-links div')).toHaveLength(2)
    })
  })

  describe('should render link for Report use of force if user caseload IS  UoF enabled prison', () => {
    const headerProps = {
      inmateData: inmate(allAlerts, 'D'),
      onImageClick: jest.fn(),
      offenderNo: 'A1234RT',
      onAlertFlagClick: jest.fn(),
      showAddKeyworkerSessionLink: false,
      prisonStaffHubUrl: 'http://prisonstaffhub',
      categorisationLinkText: '',
      categorisationUrl: 'http://catTool',
      isUseOfForce: true,
      useOfForceUrl: 'http://use-of-force',
    }
    it('should render buttons if user can edit', () => {
      const wrapper = shallow(<Header userCanEdit {...headerProps} />)
      const middleSection = wrapper.find('div.visible-large > MiddleSection').shallow()

      expect(middleSection.find('div.stacked-links div')).toHaveLength(3)
      expect(middleSection.find("a[data-qa='use-of-force-link']").getElement().props.href).toEqual(
        'http://use-of-force/report/100/report-use-of-force'
      )
    })
  })
})
