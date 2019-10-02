import React from 'react'
import { shallow } from 'enzyme'
import { Pathfinder } from '../index'

describe('Pathfinder', () => {
  it('should display a link to pathfinder for the URL provided', () => {
    const component = shallow(<Pathfinder pathfinderUrl="https://pathfinder" />)
    expect(component.find('a[href="https://pathfinder"]')).toHaveLength(1)
  })
})
