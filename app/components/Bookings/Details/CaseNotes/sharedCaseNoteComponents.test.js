import React from 'react';
import { render } from 'enzyme';
import { IntlProvider } from 'react-intl';
import {
  DateTimeBlock,
  DateTimeBlock2,
} from './sharedCaseNoteComponents';


describe('Localized date and time rendering', () => {
  const dateTimeString = '2018-06-30T23:30:00.000000';
  const expectedHtml = '<div><span><span>30/06/2018</span></span><span> - </span><span><span>23:30</span></span></div>';

  it('DateTimeBlock renders date and time from an ISO8601 formatted string', () => {
    const wrapper = render((<IntlProvider locale="en-gb"><DateTimeBlock dateTime={dateTimeString} /></IntlProvider>));
    expect(wrapper.html()).toEqual(expectedHtml);
  });

  it('DateTimeBlock2 renders date and time from an ISO8601 formatted string', () => {
    const wrapper = render((<IntlProvider locale="en-gb"><DateTimeBlock2 dateTime={dateTimeString} /></IntlProvider>));
    expect(wrapper.html()).toEqual(expectedHtml);
  });
});
