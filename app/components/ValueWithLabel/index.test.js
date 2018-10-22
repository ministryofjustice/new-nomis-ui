import React from 'react'
import { shallow } from 'enzyme'
import ValueWithLabel from '.'

describe('<ValueWithLabel />', () => {
  const labelText = 'Label Text'
  const wrapper = shallow(<ValueWithLabel label={labelText} />)

  it('should render without error', () => {
    expect(wrapper.find('.value-with-label').exists()).toBe(true)
  })

  it('should render the correct label text', () => {
    expect(wrapper.find('.value-with-label__label').text()).toEqual(labelText)
  })

  it('should render the placeholder value text when a value is NOT provided', () => {
    expect(wrapper.find('.value-with-label__value').text()).toEqual('--')
  })

  it('should render the correct value text when a value is provided', () => {
    const valueText = 'Value Text'
    wrapper.setProps({ children: valueText })
    expect(wrapper.find('.value-with-label__value').text()).toEqual(valueText)
  })

  it('should apply the correct class for indented items', () => {
    wrapper.setProps({ indent: true })
    expect(wrapper.find('.value-with-label__label').hasClass('shift-right')).toBe(true)
  })
})
