import { Map } from 'immutable';
import moment from 'moment';
import { validate } from '../index';

describe('Create appointment validation', () => {
  it('check that Appointment type, location, date and start time have been entered', () => {
    const error = validate(Map({

    }));

    expect(error.appointmentType).toBe('Please select an appointment type');
    expect(error.location).toBe('Please select a location');
    expect(error.eventDate).toBe('Please select a date');
    expect(error.startTime).toBe('Please select a start time');
  });

  it('should ensure that the event date is not in the past', () => {
    const yesterday = moment();

    yesterday.subtract(1, 'day');

    const error = validate(Map({
      eventDate: yesterday,
    }));

    expect(error.eventDate).toBe("Date shouldn't be in the past");
  });

  it('should ensure that start and end time are not in the past when the event date is today', () => {
    const afternoon = moment();
    afternoon.hour(1);

    const error = validate(Map({
      eventDate: afternoon,
      startTime: afternoon,
      endTime: afternoon,
    }));

    expect(error.startTime).toBe('Start time shouldn\'t be in the past');
    expect(error.endTime).toBe('End time shouldn\'t be in the past');
  });

  it('should ensure the end time does not come before the start time', () => {
    const tomorrow = moment().add(1, 'days');
    const startTime = moment().add(1, 'days');
    const endTime = moment().add(1, 'days');

    startTime.hour(23);
    endTime.hour(0);

    const error = validate(Map({
      eventDate: tomorrow,
      startTime,
      endTime,
    }));

    expect(error.endTime).toBe('End time shouldn\'t be before Start time');
  });

  it('should ensure a valid event date is entered', () => {
    const error = validate(Map({
      eventDate: 'aljshdflakhdKJHFD',
    }));

    expect(error.eventDate).toBe('Please enter a valid date');
  });

  it('should ensure the correct error message when there are no locations available', () => {
    const error = validate(Map({}), { viewModel: { locations: [] } });

    expect(error.location).toBe('No appointment locations set up; please see your Systems administrator');
  });
});
