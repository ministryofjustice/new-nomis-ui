import React from 'react';
import { shallow } from 'enzyme';
import { Activities } from '../index';

describe('Event component', () => {
  it('should display a message indicating no schedule for today', () => {
    const component = shallow(<Activities />);

    expect(component.contains(<label>{"Today's"} schedule is empty</label>)).toBe(true);
  });
});