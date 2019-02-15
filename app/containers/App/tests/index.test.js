import React from 'react'
import { shallow } from 'enzyme'
import { App } from '../index'

jest.mock('../../../components/Spinner/index', () => '')

const mockHistoryObject = {
  action: 'POP',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  listen: jest.fn(),
  location: {
    hash: 'test',
    pathname: '/path/name',
    search: 'searchString',
  },
  push: jest.fn(),
  replace: jest.fn(),
}

const mailTo = 'email@test.com'
const prisonStaffHubUrl = '//prisonStaffHubUrl'

describe('App container', () => {
  it('should render correctly', () => {
    const app = shallow(
      <App
        history={mockHistoryObject}
        routes={[]}
        params={{ offenderNo: '123456' }}
        boundSetDeviceFormat={() => {}}
        boundSetMenuOpen={() => {}}
        boundRetrieveUserMe={() => {}}
        boundSetAppConfig={() => {}}
        hideTermsAndConditions={() => {}}
        showTermsAndConditions={jest.fn()}
        menuOpen={false}
        shouldShowSpinner={false}
        shouldShowMenu={false}
        shouldShowTerms={false}
        mailTo={mailTo}
        prisonStaffHubUrl={prisonStaffHubUrl}
      />
    ) //
    expect(app.find('Connect(MobileMenu)').exists()).toBe(false)
    expect(app.find('div.main-content').exists()).toBe(true)
  })

  it('should close tbe menu when the background is clicked', () => {
    const setMenuOpen = jest.fn()

    const app = shallow(
      <App
        boundSetMenuOpen={setMenuOpen}
        routes={[]}
        history={mockHistoryObject}
        params={{ offenderNo: '123' }}
        boundSetDeviceFormat={() => {}}
        boundRetrieveUserMe={() => {}}
        boundSetAppConfig={() => {}}
        hideTermsAndConditions={() => {}}
        showTermsAndConditions={jest.fn()}
        menuOpen={false}
        shouldShowSpinner={false}
        shouldShowMenu={false}
        shouldShowTerms={false}
        mailTo={mailTo}
        prisonStaffHubUrl={prisonStaffHubUrl}
      />
    )
    const event = {
      preventDefault: () => {},
    }

    app.instance().onBackgroundClick(event)

    expect(setMenuOpen).toHaveBeenCalledWith(false)
  })

  it('should pass through correct props to the footer container', () => {
    const wrapper = shallow(
      <App
        boundSetMenuOpen={jest.fn()}
        routes={[]}
        history={mockHistoryObject}
        params={{ offenderNo: '123' }}
        boundSetDeviceFormat={() => {}}
        boundRetrieveUserMe={() => {}}
        boundSetAppConfig={() => {}}
        hideTermsAndConditions={() => {}}
        showTermsAndConditions={jest.fn()}
        menuOpen={false}
        shouldShowSpinner={false}
        shouldShowMenu={false}
        shouldShowTerms={false}
        mailTo={mailTo}
        prisonStaffHubUrl={prisonStaffHubUrl}
      />
    )

    expect(wrapper.find({ feedbackEmail: mailTo }).prop('prisonStaffHubUrl')).toEqual(prisonStaffHubUrl)
  })
})
