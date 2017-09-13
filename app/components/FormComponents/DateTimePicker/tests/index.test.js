import React from 'react';
import { shallow, mount } from 'enzyme';
import moment from 'moment';
import {
  DEFAULT_MOMENT_DATE_FORMAT_SPEC,
  DEFAULT_MOMENT_TIME_FORMAT_SPEC,
  DATE_TIME_FORMAT_SPEC,
} from 'containers/App/constants';

import DateTimePicker, {
  DateTimePickerDisplay,
  ReadOnlyDateTimeView,
} from '../index';

describe('DateTimePicker', () => {
  const props = {
    meta: { touched: false, error: null },
  };

  it('should have ReadOnlyDateTimeView the default view', () => {
    const dateTimePicker = shallow(<DateTimePicker {...props} />);

    const dateTimeDisplayNode = dateTimePicker.find(ReadOnlyDateTimeView).node;

    expect(dateTimeDisplayNode).not.toBe(undefined);
  });

  it('should display the DateTimePickerDisplay when the edit link has been clicked', () => {
    const dateTimePicker = mount(<DateTimePicker {...props} />);

    dateTimePicker
      .find(ReadOnlyDateTimeView)
      .find('a')
      .simulate('click');

    const editModeNode = dateTimePicker.find(DateTimePickerDisplay).node;

    expect(editModeNode).not.toBe(undefined);
  });

  it('should use the default date and time format', () => {
    const dateTimePicker = mount(<DateTimePicker {...props} />);

    const { date, time, momentSnapShot } = dateTimePicker.node.state;
    const formattedDate = moment(date, 'MM/DD/YYYY').format(DEFAULT_MOMENT_DATE_FORMAT_SPEC);
    const formattedTime = moment(momentSnapShot).format(DEFAULT_MOMENT_TIME_FORMAT_SPEC);

    expect(date.toString()).toBe(formattedDate);
    expect(time.toString()).toBe(formattedTime);
  });

  it('should output the result in ISO date format', () => {
    const input = { onChange: jest.fn() };
    const dateTimePicker = shallow(<DateTimePicker input={input} {...props} />);
    const now = moment();
    const isoFormattedDate = moment(now).format(DATE_TIME_FORMAT_SPEC);

    dateTimePicker.instance().onDateTimeChange(now);

    expect(input.onChange).toBeCalledWith(isoFormattedDate);
  });

  it('should output the default date on component creation', () => {
    const input = { onChange: jest.fn() };

    mount(<DateTimePicker input={input} {...props} />);

    expect(input.onChange).toBeCalled();
  });
});
