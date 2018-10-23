import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'
import { DATE_TIME_FORMAT_SPEC } from 'containers/App/constants'

import TimePicker from '../index'

const setTime = (date, hours, minutes, seconds) => {
  date.hours(hours)
  date.minutes(minutes)
  date.seconds(seconds)

  return date.format(DATE_TIME_FORMAT_SPEC)
}

describe('Time picker', () => {
  it('should disable the component until a date has been passed in', () => {
    const meta = { touched: false }
    const picker = shallow(<TimePicker meta={meta} />)
    const selectHours = picker.find('.select-hours').props()
    const selectMinutes = picker.find('.select-minutes').props()

    expect(selectHours.disabled).toBe(true)
    expect(selectMinutes.disabled).toBe(true)
  })

  it('should not disable the component when a date has been passed in', () => {
    const meta = { touched: false }
    const picker = shallow(<TimePicker date="2017-10-10" meta={meta} />)
    const selectHours = picker.find('.select-hours').props()
    const selectMinutes = picker.find('.select-minutes').props()

    expect(selectHours.disabled).toBe(false)
    expect(selectMinutes.disabled).toBe(false)
  })

  it('should use the date passed in along with hours and minutes selected to construct a date time', () => {
    const meta = { touched: true }
    const input = {
      onChange: jest.fn(),
    }

    const picker = shallow(<TimePicker date="10/10/2017" meta={meta} input={input} />)
    const instance = picker.instance()

    instance.onHoursChange({
      target: {
        value: '21',
      },
    })

    instance.onMinutesChange({
      target: {
        value: '21',
      },
    })

    expect(input.onChange).toBeCalledWith('2017-10-10T21:21:00')
  })

  it('should only show hours after now', () => {
    const meta = { touched: true }
    const input = {
      onChange: jest.fn(),
    }

    const now = moment('2017-10-10T20:40:00')
    const picker = shallow(<TimePicker date="2017-10-10" now={now} meta={meta} input={input} futureTimeOnly />)
    const hours = picker
      .find('.select-hours')
      .props()
      .children.map(item => item.key)
    const minutes = picker
      .find('.select-minutes')
      .props()
      .children.map(item => item.key)

    expect(hours.length).toBe(5)
    expect(hours[1]).toBe('20')
    expect(hours[2]).toBe('21')
    expect(hours[3]).toBe('22')
    expect(hours[4]).toBe('23')

    expect(minutes.length).toBe(13)
  })

  it('should only show hours before now', () => {
    const meta = { touched: true }
    const input = {
      onChange: jest.fn(),
    }

    const now = moment('2017-10-10T03:15:00')
    const picker = shallow(<TimePicker date="2017-10-10" now={now} meta={meta} input={input} pastTimeOnly />)
    const hours = picker
      .find('.select-hours')
      .props()
      .children.map(item => item.key)
    const minutes = picker
      .find('.select-minutes')
      .props()
      .children.map(item => item.key)

    expect(hours.length).toBe(5)
    expect(hours[1]).toBe('00')
    expect(hours[2]).toBe('01')
    expect(hours[3]).toBe('02')
    expect(hours[4]).toBe('03')

    expect(minutes.length).toBe(13)
  })

  it('should not constrain hours or minutes when the date is not equal to today', () => {
    const meta = { touched: true }
    const input = {
      onChange: jest.fn(),
    }

    const now = moment('2017-10-10T03:15:00Z')
    const picker = shallow(<TimePicker date="2017-09-10" now={now} meta={meta} input={input} futureTimeOnly />)
    const hours = picker
      .find('.select-hours')
      .props()
      .children.map(item => item.key)
    const minutes = picker
      .find('.select-minutes')
      .props()
      .children.map(item => item.key)

    expect(hours.length).toBe(25)
    expect(minutes.length).toBe(13)
  })

  it('should only show minutes after now when futureTimeOnly is enabled', () => {
    const meta = { touched: true }
    const input = {
      onChange: jest.fn(),
    }

    const now = moment('2017-10-10T20:45:00')
    const picker = shallow(<TimePicker date="2017-10-10" now={now} meta={meta} input={input} futureTimeOnly />)
    const instance = picker.instance()

    instance.onHoursChange({
      target: {
        value: '20',
      },
    })

    const minutes = picker
      .find('.select-minutes')
      .props()
      .children.map(item => item.key)

    expect(minutes.length).toBe(4)
    expect(minutes[1]).toBe('45')
    expect(minutes[2]).toBe('50')
    expect(minutes[3]).toBe('55')
  })

  it('should only show minutes before now when pastTimeOnly is enabled', () => {
    const meta = { touched: true }
    const input = {
      onChange: jest.fn(),
    }

    const now = moment('2017-10-10T03:30:00')
    const picker = shallow(<TimePicker date="2017-10-10" now={now} meta={meta} input={input} pastTimeOnly />)
    const instance = picker.instance()

    instance.onHoursChange({
      target: {
        value: '03',
      },
    })

    const hours = picker
      .find('.select-hours')
      .props()
      .children.map(item => item.key)
    const minutes = picker
      .find('.select-minutes')
      .props()
      .children.map(item => item.key)

    expect(hours.length).toBe(5)
    expect(hours[1]).toBe('00')
    expect(hours[2]).toBe('01')
    expect(hours[3]).toBe('02')
    expect(hours[4]).toBe('03')

    expect(minutes.length).toBe(8)
    expect(minutes[1]).toBe('00')
    expect(minutes[2]).toBe('05')
    expect(minutes[3]).toBe('10')
    expect(minutes[4]).toBe('15')
    expect(minutes[5]).toBe('20')
    expect(minutes[6]).toBe('25')
    expect(minutes[7]).toBe('30')
  })

  it('should reset input when the hour value has been cleared', () => {
    const meta = { touched: true }
    const input = {
      onChange: jest.fn(),
    }

    const picker = shallow(<TimePicker date="10/10/2017" meta={meta} input={input} />)
    const instance = picker.instance()

    instance.onHoursChange({
      target: {
        value: '03',
      },
    })

    expect(input.onChange.mock.calls[0][0]).toBe('2017-10-10T03:00:00')

    instance.onHoursChange({
      target: {},
    })

    expect(input.onChange.mock.calls[1][0]).toBe('')
  })

  it("should default to today's date when no date has been past in", () => {
    const meta = { touched: true }
    const input = {
      onChange: jest.fn(),
    }

    const picker = shallow(<TimePicker meta={meta} input={input} />)
    const instance = picker.instance()

    instance.onHoursChange({
      target: {
        value: '03',
      },
    })

    instance.onMinutesChange({
      target: {
        value: '04',
      },
    })

    const today = moment()
    today.hour(3)
    today.minute(4)
    today.second(0)

    expect(input.onChange).toHaveBeenCalledWith(today.format(DATE_TIME_FORMAT_SPEC))
  })

  it('should reset the date when a new one has been passed in', async () => {
    const yesterday = moment().subtract(1, 'day')
    const meta = { touched: true }
    const input = {
      onChange: jest.fn(),
      value: setTime(yesterday, 3, 0, 0),
    }

    const picker = shallow(<TimePicker meta={meta} input={input} date={yesterday} />)

    const today = moment()

    picker.setProps({ input, meta, date: today })

    expect(input.onChange.mock.calls[0][0]).toBe(setTime(today, 3, 0, 0))
  })

  it('should default to the current hour and the nearest minute when defaultToNow is set to true', () => {
    const today = moment()
    const meta = { touched: true }
    const input = {
      onChange: jest.fn(),
    }

    const now = moment()
    now.hours(11)
    now.minutes(11)

    const picker = shallow(<TimePicker meta={meta} input={input} date={today} now={now} initialiseToNow pastTimeOnly />)

    picker.instance().componentDidMount()

    expect(input.onChange).toHaveBeenCalledWith(setTime(now, 11, 10, 0))

    expect(picker.find('.select-hours').node.props.value).toBe('11')
    expect(picker.find('.select-minutes').node.props.value).toBe('10')
  })
})
