import React from 'react';
import { shallow } from 'enzyme';
import TypeAndSubTypeSelector from '../index';

describe('TypeAndSubTypeSelector', () => {
  const types = [{ label: 'parent1', value: 'p1' }];
  const subTypes = [{ label: 'child1', value: 'c1', parent: 'p1' }];
  const TypeSelectorNode = (renderedComponent) => renderedComponent.find('[title="Type"]');
  const SubTypeSelectorNode = (renderedComponent) => renderedComponent.find('[title="Sub-type"]');

  it('should not populate subTypeValues when no parent type has been selected', () => {
    const renderedComponent = shallow(
      <TypeAndSubTypeSelector types={types} subTypes={subTypes} />
      );

    const typeSelectorProps = TypeSelectorNode(renderedComponent).node.props;
    const subTypeSelectorProps = SubTypeSelectorNode(renderedComponent).node.props;

    expect(typeSelectorProps.options.length).toBe(1);
    expect(typeSelectorProps.options[0]).toEqual(types[0]);
    expect(subTypeSelectorProps.options.length).toBe(0);
  });

  it('should populate subTypeValue options with related types once a parent type has been selected', () => {
    const renderedComponent = shallow(
      <TypeAndSubTypeSelector selectedType={types[0].value} types={types} subTypes={subTypes} />
      );

    const subTypeSelectorProps = SubTypeSelectorNode(renderedComponent).node.props;

    expect(subTypeSelectorProps.options.length).toBe(1);
    expect(subTypeSelectorProps.options[0]).toEqual(subTypes[0]);
  });

  it('should reset the subType by default', () => {
    const renderedComponent = shallow(
      <TypeAndSubTypeSelector selectedType={types[0].value} types={types} subTypes={subTypes} />
      );

    renderedComponent.instance().componentDidMount();

    expect(renderedComponent.instance().state.resetSubType).toBe(false);
  });

  it('should not reset subType once a subType has been selected', () => {
    const renderedComponent = shallow(
      <TypeAndSubTypeSelector selectedType={types[0].value} types={types} subTypes={subTypes} />
    );

    const instance = renderedComponent.instance();

    instance.onSubTypeChange();

    expect(instance.state.resetSubType).toBe(false);
  });

  it('should reset subType once a type has been selected', () => {
    const renderedComponent = shallow(
      <TypeAndSubTypeSelector selectedType={types[0].value} types={types} subTypes={subTypes} />
    );

    const instance = renderedComponent.instance();

    instance.onSubTypeChange();
    instance.onTypeChange();

    expect(instance.state.resetSubType).toBe(true);
  });

  it('should not reset subType value when a selected one has been passed in', () => {
    const renderedComponent = shallow(
      <TypeAndSubTypeSelector selectedType={types[0].value} types={types} subTypes={subTypes} selectedSubType={subTypes[0].value} />
    );

    const instance = renderedComponent.instance();

    instance.componentDidMount();

    expect(instance.state.resetSubType).toBe(false);
  });
});
