import React from 'react';
import { shallow, mount } from 'enzyme';
import MenuToggle from '../index';

describe('MenuToggle', () => {
  it('should initialise correctly when no attributes defined', () => {
    const wrapped = mount(<MenuToggle />);

    expect(wrapped.find('#nav-icon').node).not.toBe(undefined);

    expect(wrapped.state('className')).toBe('');
  });

  it('should initialise with correct className when toggleState set true', () => {
    const wrapped = mount(<MenuToggle toggleState />);

    expect(wrapped.find('#nav-icon').node).not.toBe(undefined);

    expect(wrapped.state('className')).toBe('open');
  });

  it('should call specified onToggle funtion when clicked', () => {
    const onToggle = jest.fn();
    const wrapped = shallow(<MenuToggle onToggle={onToggle} />);

    wrapped.setState({ className: 'open' });

    const button = wrapped.find('#nav-icon');
    button.simulate('click');

    expect(onToggle).toBeCalled();
  });
});
