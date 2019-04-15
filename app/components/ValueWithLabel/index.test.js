import React from 'react'
import { shallow } from 'enzyme'
import ValueWithLabel from '.'

describe('<ValueWithLabel />', () => {
  it('should render the placeholder value text when a value is NOT provided', () => {
    const wrapper = shallow(<ValueWithLabel label="Label Text" />)
    expect(wrapper.html()).toContain('Label Text')
    expect(wrapper.html()).toContain('<strong>--</strong>')
  })

  it('should render the correct value text when a value is provided', () => {
    const wrapper = shallow(<ValueWithLabel label="Label Text">value-1</ValueWithLabel>)
    expect(wrapper.html()).toContain('Label Text')
    expect(wrapper.html()).toContain('<strong>value-1</strong>')
  })
})
