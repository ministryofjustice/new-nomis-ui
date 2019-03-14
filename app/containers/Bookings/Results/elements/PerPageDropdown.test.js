import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import PerPageDropdown from './PerPageDropdown'

describe('<PerPageDropdown />', () => {
  const props = {
    handleChange: jest.fn(),
    totalResults: 999,
    perPage: 20,
  }

  it('should match the default snapshot', () => {
    const tree = renderer.create(<PerPageDropdown {...props} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should trigger the handleChange function with the total results value when selected', () => {
    const wrapper = shallow(<PerPageDropdown {...props} />)

    wrapper.find('#perPage').simulate('change', { target: { value: props.totalResults } })
    expect(props.handleChange).toBeCalledWith(props.totalResults)
  })
})
