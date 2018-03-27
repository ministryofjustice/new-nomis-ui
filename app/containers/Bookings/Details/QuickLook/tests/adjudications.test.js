import React from 'react';
import { List } from 'immutable';
import { shallow } from 'enzyme';
import { Adjudications } from '../index';

describe('Adjudications component', () => {
  it('should display a message indicating that there are no awards', () => {
    const component = shallow(<Adjudications awards={List([])} />);

    expect(component.contains(<b> No active awards </b>)).toBe(true);
  });
});