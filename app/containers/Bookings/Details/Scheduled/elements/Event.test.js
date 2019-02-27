import React from 'react'
import { shallow } from 'enzyme'

import Event from './Event'

describe('Event component', () => {
  it('should format the startTime and endTime into a time only format', () => {
    const component = shallow(
      <Event startTime="2017-12-12T08:00" endTime="2017-12-12T22:00" cancelled={false} type="" />
    )
    const startTime = component.find('.whereabouts-startTime')
    const endTime = component.find('.whereabouts-endTime')

    expect(startTime.props().children).toBe('08:00')
    expect(endTime.props().children[1]).toBe('22:00')
  })

  it('should handle the scenario where no endTime supplied', () => {
    const component = shallow(<Event startTime="2017-12-12T08:00" cancelled={false} type="" />)
    const endTime = component.find('.whereabouts-endTime')

    expect(endTime.length).toBe(0)
  })
})
