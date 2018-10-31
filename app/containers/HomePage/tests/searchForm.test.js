import React from 'react'
import { mount } from 'enzyme'
import { Map, List } from 'immutable'
import SearchForm from '../SearchForm'

describe('Search Form', () => {
  it('should hide the global search checkbox when the user does not have global search', () => {
    const store = {
      getState: () =>
        Map({
          app: Map({
            globalSearchUrl: 'http://somewhere/',
          }),
          home: Map({
            locations: List([]),
          }),
        }),
      dispatch: () => {},
      subscribe: () => {},
    }

    const wrapper = mount(<SearchForm store={store} />)
    expect(wrapper.find('.global-search').length).toBe(0)
  })

  it('should show global search checkbox when the user has global search', () => {
    const store = {
      getState: () =>
        Map({
          app: Map({
            globalSearchUrl: 'http://somewhere/',
          }),
          authentication: Map({
            user: {
              canGlobalSearch: true,
            },
          }),
          home: Map({
            locations: List([]),
          }),
        }),
      dispatch: () => {},
      subscribe: () => {},
    }
    const wrapper = mount(<SearchForm store={store} />)
    expect(wrapper.find('.global-search').length).toBe(1)
  })

  it('should display the location dropdown once the global search checkbox is checked', () => {
    const store = {
      getState: () =>
        Map({
          app: Map({
            globalSearchUrl: 'http://somewhere/',
          }),
          authentication: Map({
            user: {
              canGlobalSearch: true,
            },
          }),
          home: Map({
            locations: List([]),
          }),
        }),
      dispatch: () => {},
      subscribe: () => {},
    }

    const wrapper = mount(<SearchForm store={store} />)
    const checkBox = wrapper.find('.global-search').first()
    const dropDown = wrapper.find('.locationPrefix')

    checkBox.simulate('change', { target: { checked: true } })

    expect(dropDown.props().disabled).toBe(true)
  })

  it('should redirect to the global search site with the entered search criteria', () => {
    global.window.location.assign = jest.fn()

    const globalSearchUrl = 'http://globalsearch.com'

    const store = {
      getState: () =>
        Map({
          app: Map({
            globalSearchUrl,
          }),
          authentication: Map({
            user: {
              canGlobalSearch: true,
            },
          }),
          home: Map({
            locations: List([]),
          }),
        }),
      dispatch: jest.fn(),
      subscribe: () => {},
    }

    const wrapper = mount(<SearchForm store={store} />)
    const checkBox = wrapper.find('.global-search').first()
    const searchInput = wrapper.find('.search-input').first()
    const form = wrapper.find('.search-form').first()

    checkBox.simulate('change', { target: { checked: true } })

    searchInput.node.value = 'balog, irog'

    form.simulate('submit')

    const expectedUrl = `${globalSearchUrl}?searchText=balog%2C%20irog`

    expect(global.window.location.assign).toHaveBeenCalledWith(expectedUrl)
  })

  it('should redirect to the search results page', () => {
    const store = {
      getState: () =>
        Map({
          app: Map({
            globalSearchUrl: 'http://somewhere/',
          }),
          authentication: Map({
            user: {
              canGlobalSearch: true,
            },
          }),
          home: Map({
            locations: List([]),
          }),
        }),
      dispatch: jest.fn(),
      subscribe: () => {},
    }

    const wrapper = mount(<SearchForm store={store} />)
    const searchInput = wrapper.find('.search-input').first()
    searchInput.node.value = 'balog, irog'

    const form = wrapper.find('.search-form').first()
    form.simulate('submit')

    const expectedUrl = `/results?locationPrefix=&keywords=balog%2C%20irog&perPage=10&pageNumber=0&sortFields=lastName&sortFields=firstName&sortOrder=ASC`

    expect(store.dispatch.mock.calls[0][0].payload.args[0]).toBe(expectedUrl)
  })
})
