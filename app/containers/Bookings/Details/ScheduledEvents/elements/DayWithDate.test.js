import React from 'react'
import { shallow } from 'enzyme'
import DayWithDate from './DayWithDate'

describe('DayWithDate component', () => {
  it('should display the day only', () => {
    const component = shallow(<DayWithDate value="2017-11-21" />)
    const day = component.find('Fragment')

    expect(day.props().children).toBe('Tuesday')
  })
})
