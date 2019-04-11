import React from 'react'
import { shallow } from 'enzyme'
import DisplayValue from '../index'

describe('DisplayValue component', () => {
  it('should display a double dash when no value is present', () => {
    const displayValue = shallow(<DisplayValue value={null} />)

    expect(displayValue.html()).toBe('<span> -- </span>')
  })

  it('should display the value when defined', () => {
    const displayValue = shallow(<DisplayValue value="hello, world" />)

    expect(displayValue.html()).toBe('<span> hello, world </span>')
  })
})
