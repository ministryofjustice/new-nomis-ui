import React from 'react'
import { mount } from 'enzyme'
import { Map } from 'immutable'
import SearchForm from '../SearchForm'

describe('Search Form', () => {
  it('should hide the global search checkbox when the user does not have global search', () => {
    const store = {
      getState: () => Map({}),
      dispatch: () => {},
      subscribe: () => {},
    }

    const wrapper = mount(<SearchForm store={store} locations={[]} />)
    expect(wrapper.find('.global-search').length).toBe(0)
  })

  it('should show global search checkbox when the user has global search', () => {
    const store = {
      getState: () =>
        Map({
          authentication: Map({
            user: {
              canGlobalSearch: true,
            },
          }),
        }),
      dispatch: () => {},
      subscribe: () => {},
    }
    const wrapper = mount(<SearchForm store={store} locations={[]} />)
    expect(wrapper.find('.global-search').length).toBe(1)
  })

  it('should display the location dropdown once the global search checkbox is checked', () => {
    const store = {
      getState: () =>
        Map({
          authentication: Map({
            user: {
              canGlobalSearch: true,
            },
          }),
        }),
      dispatch: () => {},
      subscribe: () => {},
    }

    const wrapper = mount(<SearchForm store={store} locations={[]} />)
    const checkBox = wrapper.find('.global-search').first()
    const dropDown = wrapper.find('.locationPrefix')

    checkBox.simulate('change', { target: { checked: true } })

    expect(dropDown.props().disabled).toBe(true)
  })

  it('should redirect to the global search site with the entered search criteria', () => {
    const globalSearchUrl = 'http://globalsearch'

    const store = {
      getState: () =>
        Map({
          authentication: Map({
            user: {
              canGlobalSearch: true,
            },
          }),
        }),
      dispatch: jest.fn(),
      subscribe: () => {},
    }

    const wrapper = mount(<SearchForm store={store} globalSearchUrl={globalSearchUrl} locations={[]} />)
    const checkBox = wrapper.find('.global-search').first()
    const searchInput = wrapper.find('.search-input').first()
    const form = wrapper.find('.search-form').first()

    checkBox.simulate('change', { target: { checked: true } })

    searchInput.node.value = 'balog, irog'

    form.simulate('submit')

    const expectedUrl = `${globalSearchUrl}?locationPrefix=&keywords=balog%2C%20irog&perPage=10&pageNumber=0&sortOrder=ASC`

    expect(store.dispatch.mock.calls[0][0].payload.args[0]).toBe(expectedUrl)
  })

  it('should redirect to the search results page', () => {
    const store = {
      getState: () =>
        Map({
          authentication: Map({
            user: {
              canGlobalSearch: true,
            },
          }),
        }),
      dispatch: jest.fn(),
      subscribe: () => {},
    }

    const wrapper = mount(<SearchForm store={store} locations={[]} />)
    const searchInput = wrapper.find('.search-input').first()
    const form = wrapper.find('.search-form').first()

    searchInput.node.value = 'balog, irog'

    form.simulate('submit')

    const expectedUrl = `/results?locationPrefix=&keywords=balog%2C%20irog&perPage=10&pageNumber=0&sortOrder=ASC`

    expect(store.dispatch.mock.calls[0][0].payload.args[0]).toBe(expectedUrl)
  })
})
