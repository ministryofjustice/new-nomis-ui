import moment from 'moment';
import { Map } from 'immutable';
import { validate } from '../filterForm';

describe('Filter form validation', () => {
  it('should ensure that the start date does not come before the end date', () => {
    const values = Map({
      startDate: moment({ year: 2018, M: 9, d: 10 }),
      endDate: moment({ year: 2018, M: 9, d: 9 }),
    });

    const errors = validate(values);

    expect(errors.error.dateRangeValid).toBe(false);
  });
});