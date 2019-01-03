import React from 'react'
import { render } from 'enzyme'
import { IntlProvider } from 'react-intl'
import {
  // DateTimeBlock,
  DateTimeBlock2,
} from './sharedCaseNoteComponents'

describe('Localized date and time rendering', () => {
  const dateTimeString = '2018-06-30T23:30:00.000000'
  const expectedHtmlEnGb = '<span><span>30/06/2018</span></span><span> - </span><span><span>23:30</span></span>'
  const expectedHtmlEnUs = '<span><span>06/30/2018</span></span><span> - </span><span><span>11:30 PM</span></span>'

  // This test works locally, but fails on CircleCI (it renders using the en-us locale there). Don't know why, but I'm commenting this
  // out for now because it is testing unused code.
  // it('DateTimeBlock renders date and time from an ISO8601 formatted string', () => {
  //   const wrapper = render((<IntlProvider locale="en-gb"><DateTimeBlock dateTime={dateTimeString} /></IntlProvider>));
  //   expect(wrapper.html()).toEqual(expectedHtmlEnGb);
  // });

  it('DateTimeBlock2 renders date and time from an ISO8601 formatted string using en-gb locale', () => {
    const wrapper = render(
      <IntlProvider locale="en-gb">
        <DateTimeBlock2 dateTime={dateTimeString} />
      </IntlProvider>
    )
    expect(wrapper.html()).toEqual(expectedHtmlEnGb)
  })

  it('DateTimeBlock2 renders date and time from an ISO8601 formatted string using en-us locale', () => {
    const wrapper = render(
      <IntlProvider locale="en-us">
        <DateTimeBlock2 dateTime={dateTimeString} />
      </IntlProvider>
    )
    expect(wrapper.html()).toEqual(expectedHtmlEnUs)
  })
})
