import { Map } from 'immutable';
import moment from 'moment';
import { validate } from '../index';

describe('Add casenote validation', () => {
  it('should check that type, subtype, comment and occurrenceDateTime have been entered', () => {
    const error = validate(Map({

    }));

    expect(error.typeValue).toBe('Required');
    expect(error.subTypeValue).toBe('Required');
    expect(error.caseNoteText).toBe('Required');
    expect(error.occurrenceDateTime).toBe('Required');
  });


  it('should not allow occurrence date in the future', () => {
    const today = moment();
    const tomorrow = today.add(1, 'days');


    const error = validate(Map({
      occurrenceDateTime: tomorrow,
    }));

    expect(error.occurrenceDateTime).toBe('Occurrence date and time can\'t be in the future');
  });
});
