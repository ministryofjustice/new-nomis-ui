import React from 'react';
import { shallow } from 'enzyme';
import { Activities } from '../index';

describe('Activities component', () => {
  it('should display a message indicating that there are no assigned activity', () => {
    const component = shallow(<Activities />);

    expect(component.contains(<label>{"Today's"} schedule is empty</label>)).toBe(true);
  });
});