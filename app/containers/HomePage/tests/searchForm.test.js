import React from 'react'
import { mount } from 'enzyme'
import { SearchForm } from '../SearchForm'

describe('Search Form', () => {
  const props = {
    canGlobalSearch: false,
    globalSearchUrl: 'http://somewhere/',
    locations: [],
    onSubmit: jest.fn(),
    dispatch: jest.fn(),
  }
  it('should hide the global search checkbox when the user does not have global search', () => {
    const wrapper = mount(<SearchForm {...props} />)
    expect(wrapper.find('.global-search').length).toBe(0)
  })

  it('should show global search checkbox when the user has global search', () => {
    props.canGlobalSearch = true
    const wrapper = mount(<SearchForm {...props} />)
    expect(wrapper.find('.global-search').length).toBe(1)
  })

  it('should display the location dropdown once the global search checkbox is checked', () => {
    const wrapper = mount(<SearchForm {...props} />)
    wrapper.find('.global-search').simulate('change', { target: { checked: true } })

    expect(wrapper.find('.locationPrefix').props().disabled).toBe(true)
  })

  it('should redirect to the global search site with the entered search criteria', () => {
    const wrapper = mount(<SearchForm {...props} />)
    const checkBox = wrapper.find('.global-search').first()
    const searchInput = wrapper.find('.search-input').first()
    const form = wrapper.find('.search-form').first()

    checkBox.simulate('change', { target: { checked: true } })

    searchInput.instance().value = 'balog, irog'

    form.simulate('submit')

    expect(props.onSubmit).toHaveBeenCalledWith({ keywords: 'balog, irog' }, props.globalSearchUrl)
  })
})
