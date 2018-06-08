import { Map } from 'immutable';
import { validate } from '../index';

describe('Add case note validation', () => {
  it('should check that type, subtype, comment and occurrenceDateTime have been entered', () => {
    const error = validate(Map({

    }));

    expect(error.typeValue).toBe('Required');
    expect(error.subTypeValue).toBe('Required');
    expect(error.caseNoteText).toBe('Required');
    expect(error.startTime).toBe('Please select a time');
    expect(error.endTime).toBe(undefined);
  });
});
