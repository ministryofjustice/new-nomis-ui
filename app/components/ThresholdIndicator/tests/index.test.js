import React from 'react'
import { shallow } from 'enzyme'
import ThresholdIndicator from '../index'

describe('ThresholdIndicator component', () => {
  it('should not colour code the indicator when no maximum limit has been set', () => {
    const wrapper = shallow(<ThresholdIndicator />)
    const result = wrapper.find('.threshold-indicator > span').node

    expect(result.props.className).toBe(undefined)
  })
  it('should add the high style when the value exceeds the maximum threshold', () => {
    const wrapper = shallow(<ThresholdIndicator maximum={5} value={6} />)
    const result = wrapper.find('.threshold-indicator > span').node

    expect(result.props.className).toBe('high')
  })
  it('should add the medimum style when the value equals the maximum threshold', () => {
    const wrapper = shallow(<ThresholdIndicator maximum={5} value={5} />)
    const result = wrapper.find('.threshold-indicator > span').node

    expect(result.props.className).toBe('medium')
  })

  it('should add the low style when the value is less then the maximum threshold', () => {
    const wrapper = shallow(<ThresholdIndicator maximum={5} value={2} />)
    const result = wrapper.find('.threshold-indicator > span').node

    expect(result.props.className).toBe('low')
  })

  it('should add the none style when the value is equal to zero', () => {
    const wrapper = shallow(<ThresholdIndicator maximum={5} />)
    const result = wrapper.find('.threshold-indicator > span').node

    expect(result.props.className).toBe('none')
  })
})
