import React from 'react';
import { shallow, mount } from 'enzyme';
import MenuToggle from '../index';

describe('MenuToggle', () => {
  it('should initialise correctly when no attributes defined', () => {
    const wrapped = mount(<MenuToggle />);
    const elem = wrapped.find('#nav-icon').node;

    expect(elem).not.toBe(undefined);

    expect(elem.className).toBe('');
  });

  it('should initialise with correct className when toggleState set true', () => {
    const wrapped = mount(<MenuToggle menuOpen />);
    const elem = wrapped.find('#nav-icon').node;

    expect(elem).not.toBe(undefined);

    expect(elem.className).toBe('open');
  });

  it('should call specified onToggle funtion when clicked', () => {
    const onToggle = jest.fn();
    const wrapped = shallow(<MenuToggle toggleMenu={onToggle} />);
    const button = wrapped.find('#nav-icon');

    button.simulate('click');

    expect(onToggle).toBeCalled();
  });
});
