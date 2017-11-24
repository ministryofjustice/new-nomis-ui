import React from 'react';
import { shallow } from 'enzyme'

import { Appointment } from '../index';

describe('Appointment component', () => {
  it('should format the startTime and endTime into a time only format', () => {
    const component = shallow(<Appointment startTime={'2017-12-12T08:00'} endTime={'2017-12-12T22:00'} />);
    const startTime = component.find('.whereabouts-startTime').node;
    const endTime = component.find('.whereabouts-endTime').node;

    expect(startTime.props.children).toBe('08:00');
    expect(endTime.props.children[1]).toBe('22:00');
  });

  it('should handle the scenario where no endTime supplied', () => {
    const component = shallow(<Appointment startTime={'2017-12-12T08:00'} endTime={null} />);
    const endTime = component.find('.whereabouts-endTime').node;

    expect(endTime.props.children[1]).toBe(null);
  });
})

