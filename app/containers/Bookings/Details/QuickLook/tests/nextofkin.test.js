import React from 'react';
import { shallow } from 'enzyme';
import { List } from 'immutable';
import { NextOfKin } from '../index';

describe('Next of kin component', () => {
  it('should display a message indicating that there is no next of kin', () => {
    const component = shallow(<NextOfKin nextOfKin={List([])} />);

    expect(component.contains(<b> No next of kin identified </b>)).toBe(true);
  });
});