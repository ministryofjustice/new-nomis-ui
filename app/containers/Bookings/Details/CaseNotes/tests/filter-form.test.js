import { Map } from 'immutable';
import { validate } from '../filterForm';

describe('Filter form validation', () => {
  it('should ensure that the start date does not come before the end date', () => {
    const values = Map({
      startDate: '10/10/2018',
      endDate: '09/10/2018',
    });

    const errors = validate(values);

    expect(errors._error.dateRangeValid).toBe(false);
  });
});