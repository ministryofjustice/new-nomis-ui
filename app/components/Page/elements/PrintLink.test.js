import React from 'react'
import { shallow } from 'enzyme'
import PrintLink from './PrintLink'

describe('<PrintLink />', () => {
  global.print = jest.fn()
  const wrapper = shallow(<PrintLink />)

  it('should render the correct text', () => {
    expect(wrapper.find('span').text()).toEqual('Print this page')
  })

  it('should call the global/window print method when clicked', () => {
    wrapper.simulate('click')
    expect(global.print).toBeCalled()
  })
})
