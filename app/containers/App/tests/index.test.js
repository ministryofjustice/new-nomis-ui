import React from 'react'
import { shallow } from 'enzyme'
import { App } from '../index'

jest.mock('../../../components/Spinner/index', () => '')

describe('App container', () => {
  it('should render correctly', () => {
    const app = shallow(
      <App
        router={{ location: {} }}
        params={{ offenderNo: '123456' }}
        boundSetDeviceFormat={() => {}}
        boundSetMenuOpen={() => {}}
        boundRetrieveUserMe={() => {}}
        boundSetAppConfig={() => {}}
        hideTermsAndConditions={() => {}}
        menuOpen={false}
        shouldShowSpinner={false}
        shouldShowMenu={false}
        shouldShowTerms={false}
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
        router={{ location: {} }}
        params={{ offenderNo: '123' }}
        boundSetDeviceFormat={() => {}}
        boundRetrieveUserMe={() => {}}
        boundSetAppConfig={() => {}}
        hideTermsAndConditions={() => {}}
        menuOpen={false}
        shouldShowSpinner={false}
        shouldShowMenu={false}
        shouldShowTerms={false}
      />
    )
    const event = {
      preventDefault: () => {},
    }

    app.instance().onBackgroundClick(event)

    expect(setMenuOpen).toHaveBeenCalledWith(false)
  })
})
