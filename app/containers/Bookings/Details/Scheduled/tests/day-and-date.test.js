import React from 'react';
import { shallow } from 'enzyme';
import { DayAndDate } from '../index';

describe('DayAndDate component', () => {
  it('should display the day only', () => {
    const component = shallow(<DayAndDate value="2017-11-21" />);

    const day = component.find('.whereabouts-day-header').node;

    expect(day.props.children).toBe('Tuesday');
  });
});