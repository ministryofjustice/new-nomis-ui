import React from 'react'
import { shallow } from 'enzyme'
import { Pathfinder } from '../index'

describe('Pathfinder', () => {
  it('should display link a to pathfinder when the user is allowed', () => {
    const component = shallow(<Pathfinder isPathfinderUser pathfinderUrl="https://pathfinder" />)
    expect(component.find('a[href="https://pathfinder"]')).toHaveLength(1)
  })

  it('should not display a link to pathfinder when the user is not allowed', () => {
    const component = shallow(<Pathfinder isPathfinderUser={false} pathfinderUrl="https://pathfinder" />)
    expect(component.find('a[href="https://pathfinder"]')).toHaveLength(0)
  })
})
