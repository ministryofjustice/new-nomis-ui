import { Map } from 'immutable'
import moment from 'moment'
import { calculateLastRepeatDate, validate } from '../index'

describe('Create appointment functions', () => {
  describe('validate', () => {
    it('check that Appointment type, location, date and start time have been entered', () => {
      const error = validate(Map({}))

      expect(error.appointmentType).toBe('Select appointment type')
      expect(error.location).toBe('Select location')
      expect(error.eventDate).toBe('Select date')
      expect(error.startTime).toBe('Select start time')
    })

    it('should ensure that the event date is not in the past', () => {
      const yesterday = moment()

      yesterday.subtract(1, 'day')

      const error = validate(
        Map({
          eventDate: yesterday,
        })
      )

      expect(error.eventDate).toBe('The start date must not be in the past')
    })

    it('should ensure that start and end time are not in the past when the event date is today', () => {
      const afternoon = moment()
      afternoon.hour(1)

      const error = validate(
        Map({
          eventDate: afternoon,
          startTime: afternoon,
          endTime: afternoon,
        })
      )

      expect(error.startTime).toBe('The start time must not be in the past')
      expect(error.endTime).toBe('The end time must be in the future')
    })

    it('should ensure the end time does not come before the start time', () => {
      const tomorrow = moment().add(1, 'days')
      const startTime = moment().add(1, 'days')
      const endTime = moment().add(1, 'days')

      startTime.hour(23)
      endTime.hour(0)

      const error = validate(
        Map({
          eventDate: tomorrow,
          startTime,
          endTime,
        })
      )

      expect(error.endTime).toBe('The end time must be after the start time')
    })

    it('should ensure the correct error message when there are no locations available', () => {
      const error = validate(Map({}), { viewModel: { locations: [] } })

      expect(error.location).toBe('No appointment locations set up; please see your Systems administrator')
    })

    it('Should ensure that the repeat count is at least 1', () => {
      const error = validate(
        Map({
          recurringAppointment: true,
          repeatCount: 0,
        })
      )
      expect(error.repeatCount).toBe('Number of times must be at least 1')
    })

    it('Should ensure that there is a valid repeat period', () => {
      const error = validate(
        Map({
          recurringAppointment: true,
        })
      )
      expect(error.repeatPeriod).toBe('Select a repeat period')
    })

    it('Should ensure that start day not a Saturday when repeat period is Weekdays', () => {
      const error = validate(
        Map({
          recurringAppointment: true,
          repeatPeriod: 'WEEKDAYS',
          eventDate: moment({ year: 2019, month: 0, day: 5 }), // 5th January 2019 - Saturday
        })
      )
      expect(error.repeatPeriod).toBe('Start day must be Monday - Friday for weekday repeats')
    })

    it('Should ensure that start day not a Sunday when repeat period is Weekdays', () => {
      const error = validate(
        Map({
          recurringAppointment: true,
          repeatPeriod: 'WEEKDAYS',
          eventDate: moment({ year: 2019, month: 0, day: 6 }), // 6th January 2019 - Sunday
        })
      )
      expect(error.repeatPeriod).toBe('Start day must be Monday - Friday for weekday repeats')
    })

    it('Should ensure that the last appointment date falls within one year (DAILY repeats).', () => {
      const error = validate(
        Map({
          recurringAppointment: true,
          repeatPeriod: 'DAILY',
          repeatCount: 366, // A leap year has 366 days...
          eventDate: moment(),
        })
      )
      expect(error.repeatCount).toBe('Last appointment must be within one year')
    })

    it('Should ensure that the last appointment date falls within one year (WEEKLY repeats).', () => {
      const error = validate(
        Map({
          recurringAppointment: true,
          repeatPeriod: 'WEEKLY',
          repeatCount: 54, // 53 falls one day short if it brackets a leap year...
          eventDate: moment(),
        })
      )
      expect(error.repeatCount).toBe('Last appointment must be within one year')
    })

    it('Should ensure that the last appointment date falls within one year (MONTHLY repeats).', () => {
      const error = validate(
        Map({
          recurringAppointment: true,
          repeatPeriod: 'MONTHLY',
          repeatCount: 13,
          eventDate: moment(),
        })
      )
      expect(error.repeatCount).toBe('Last appointment must be within one year')
    })

    it('Should accept valid repeat values!', () => {
      const error = validate(
        Map({
          recurringAppointment: true,
          repeatPeriod: 'DAILY',
          repeatCount: 364,
          eventDate: moment(),
        })
      )
      expect(error.repeatCount).toBeUndefined()
      expect(error.repeatPeriod).toBeUndefined()
    })
  })

  describe('calculateLastAppointmentDate', () => {
    it('no startDate', () => {
      expect(calculateLastRepeatDate(undefined, 'WEEKS', 1)).toBeUndefined()
    })

    it('no repeatPeriod', () => {
      expect(calculateLastRepeatDate(moment(), undefined, 1)).toBeUndefined()
    })

    it('no repeatCount', () => {
      expect(calculateLastRepeatDate(moment(), 'DAYS', undefined)).toBeUndefined()
    })

    it('repeatCount < 1', () => {
      expect(calculateLastRepeatDate(moment(), 'DAYS', 0)).toBeUndefined()
    })

    const asMoment = (year, month, day) => moment({ year, month, day })

    const createCalculationResultAsserter = (startDate, repeatPeriod) => (repeatCount, expectedEndDate) =>
      expect(calculateLastRepeatDate(startDate, repeatPeriod, repeatCount).toISOString()).toEqual(
        expectedEndDate.toISOString()
      )

    it('DAILY repeats', () => {
      const monday = asMoment(2019, 1, 4) // Monday, 4th February

      const assertResult = createCalculationResultAsserter(asMoment(2019, 1, 4), 'DAILY')

      assertResult(1, asMoment(2019, 1, 4))
      assertResult(2, asMoment(2019, 1, 5))
      assertResult(3, asMoment(2019, 1, 6))
      assertResult(4, asMoment(2019, 1, 7))
      assertResult(5, asMoment(2019, 1, 8))
      assertResult(6, asMoment(2019, 1, 9))
      assertResult(7, asMoment(2019, 1, 10))
    })

    it('WEEKLY repeats', () => {
      const assertResult = createCalculationResultAsserter(asMoment(2019, 1, 4), 'WEEKLY')

      assertResult(1, asMoment(2019, 1, 4))
      assertResult(2, asMoment(2019, 1, 11))
      assertResult(3, asMoment(2019, 1, 18))
      assertResult(4, asMoment(2019, 1, 25))
      assertResult(5, asMoment(2019, 2, 4))
      assertResult(6, asMoment(2019, 2, 11))
      assertResult(7, asMoment(2019, 2, 18))
    })

    it('FORTNIGHTLY repeats', () => {
      const assertResult = createCalculationResultAsserter(asMoment(2019, 1, 4), 'FORTNIGHTLY')

      assertResult(1, asMoment(2019, 1, 4))
      assertResult(2, asMoment(2019, 1, 18))
      assertResult(3, asMoment(2019, 2, 4))
      assertResult(4, asMoment(2019, 2, 18))
      assertResult(5, asMoment(2019, 3, 1))
      assertResult(6, asMoment(2019, 3, 15))
      assertResult(7, asMoment(2019, 3, 29))
    })

    it('WEEKDAYS repeats from Monday', () => {
      const monday = asMoment(2019, 1, 4) // Monday, 4th February
      expect(monday.isoWeekday()).toBe(1)

      const assertResult = createCalculationResultAsserter(monday, 'WEEKDAYS')

      assertResult(1, asMoment(2019, 1, 4))
      assertResult(2, asMoment(2019, 1, 5))
      assertResult(3, asMoment(2019, 1, 6))
      assertResult(4, asMoment(2019, 1, 7))
      assertResult(5, asMoment(2019, 1, 8)) // Friday
      assertResult(6, asMoment(2019, 1, 11)) // Monday
      assertResult(7, asMoment(2019, 1, 12))
      assertResult(8, asMoment(2019, 1, 13))
      assertResult(9, asMoment(2019, 1, 14))
      assertResult(10, asMoment(2019, 1, 15))
    })

    it('WEEKDAYS repeats from Wednesday', () => {
      const wednesday = asMoment(2019, 1, 6) // Wednesday, 6th February
      expect(wednesday.isoWeekday()).toBe(3)

      const assertResult = createCalculationResultAsserter(wednesday, 'WEEKDAYS')

      assertResult(1, asMoment(2019, 1, 6))
      assertResult(2, asMoment(2019, 1, 7))
      assertResult(3, asMoment(2019, 1, 8)) // Friday
      assertResult(4, asMoment(2019, 1, 11)) // Monday
      assertResult(5, asMoment(2019, 1, 12))
      assertResult(6, asMoment(2019, 1, 13))
      assertResult(7, asMoment(2019, 1, 14))
      assertResult(8, asMoment(2019, 1, 15)) // Friday
      assertResult(9, asMoment(2019, 1, 18)) // Monday
      assertResult(10, asMoment(2019, 1, 19))
    })

    it('WEEKDAYS repeats from Friday', () => {
      const friday = asMoment(2019, 1, 8) // Wednesday, 8th February
      expect(friday.isoWeekday()).toBe(5)

      const assertResult = createCalculationResultAsserter(friday, 'WEEKDAYS')

      assertResult(1, asMoment(2019, 1, 8)) // Friday
      assertResult(2, asMoment(2019, 1, 11)) // Monday
      assertResult(3, asMoment(2019, 1, 12))
      assertResult(4, asMoment(2019, 1, 13))
      assertResult(5, asMoment(2019, 1, 14))
      assertResult(6, asMoment(2019, 1, 15)) // Friday
      assertResult(7, asMoment(2019, 1, 18)) // Monday
      assertResult(8, asMoment(2019, 1, 19))
      assertResult(9, asMoment(2019, 1, 20))
      assertResult(10, asMoment(2019, 1, 21))
      assertResult(11, asMoment(2019, 1, 22)) // Friday
      assertResult(12, asMoment(2019, 1, 25)) // Monday
    })

    it('WEEKDAYS with start date at weekend', () => {
      expect(calculateLastRepeatDate(asMoment(2019, 1, 9), 'WEEKDAYS', 1)).toBeUndefined() // Saturday
      expect(calculateLastRepeatDate(asMoment(2019, 1, 10), 'WEEKDAYS', 1)).toBeUndefined() // Sunday
    })

    it('MONTHLY repeats. last day of month.', () => {
      const assertResult = createCalculationResultAsserter(asMoment(2019, 0, 31), 'MONTHLY') // 31st January 2019

      assertResult(1, asMoment(2019, 0, 31)) // Jan
      assertResult(2, asMoment(2019, 1, 28)) // Feb
      assertResult(3, asMoment(2019, 2, 31)) // Mar
      assertResult(4, asMoment(2019, 3, 30))
      assertResult(5, asMoment(2019, 4, 31))
      assertResult(6, asMoment(2019, 5, 30)) // June
      assertResult(7, asMoment(2019, 6, 31)) // July
    })
  })
})
