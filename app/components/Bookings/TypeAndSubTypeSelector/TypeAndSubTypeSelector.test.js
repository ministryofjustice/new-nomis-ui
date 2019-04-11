import React from 'react'
import { shallow } from 'enzyme'

import TypeAndSubTypeSelector from '.'

describe('TypeAndSubTypeSelector', () => {
  const types = [{ label: 'parent1', value: 'p1' }]
  const subTypes = [{ label: 'child1', value: 'c1', parent: 'p1' }]
  const TypeSelectorNode = renderedComponent => renderedComponent.find('[name="typeValue"]')
  const SubTypeSelectorNode = renderedComponent => renderedComponent.find('[name="subTypeValue"]')

  it('should not populate subTypeValues when no parent type has been selected', () => {
    const renderedComponent = shallow(<TypeAndSubTypeSelector types={types} subTypes={subTypes} />)
    const typeSelectorOptions = TypeSelectorNode(renderedComponent).children()
    const subTypeSelectorOptions = SubTypeSelectorNode(renderedComponent).children()

    expect(typeSelectorOptions.find('option')).toHaveLength(1)
    expect(typeSelectorOptions.find('option').prop('value')).toEqual('p1')
    expect(typeSelectorOptions.find('option').text()).toEqual('parent1')
    expect(subTypeSelectorOptions.find('option')).toHaveLength(0)
  })

  it('should populate subTypeValue options with related types once a parent type has been selected', () => {
    const renderedComponent = shallow(
      <TypeAndSubTypeSelector selectedType={types[0].value} types={types} subTypes={subTypes} />
    )
    const subTypeSelectorOptions = SubTypeSelectorNode(renderedComponent).children()

    expect(subTypeSelectorOptions.find('option')).toHaveLength(1)
    expect(subTypeSelectorOptions.find('option').prop('value')).toEqual('c1')
    expect(subTypeSelectorOptions.find('option').text()).toEqual('child1')
  })

  it('should reset the subType by default', () => {
    const renderedComponent = shallow(
      <TypeAndSubTypeSelector selectedType={types[0].value} types={types} subTypes={subTypes} />
    )

    renderedComponent.instance().componentDidMount()

    expect(renderedComponent.instance().state.resetSubType).toBe(false)
  })

  it('should not reset subType once a subType has been selected', () => {
    const renderedComponent = shallow(
      <TypeAndSubTypeSelector selectedType={types[0].value} types={types} subTypes={subTypes} />
    )

    const instance = renderedComponent.instance()

    instance.onSubTypeChange()

    expect(instance.state.resetSubType).toBe(false)
  })

  it('should reset subType once a type has been selected', () => {
    const renderedComponent = shallow(
      <TypeAndSubTypeSelector selectedType={types[0].value} types={types} subTypes={subTypes} />
    )

    const instance = renderedComponent.instance()

    instance.onSubTypeChange()
    instance.onTypeChange()

    expect(instance.state.resetSubType).toBe(true)
  })

  it('should not reset subType value when a selected one has been passed in', () => {
    const renderedComponent = shallow(
      <TypeAndSubTypeSelector
        selectedType={types[0].value}
        types={types}
        subTypes={subTypes}
        selectedSubType={subTypes[0].value}
      />
    )

    const instance = renderedComponent.instance()

    instance.componentDidMount()

    expect(instance.state.resetSubType).toBe(false)
  })
})
