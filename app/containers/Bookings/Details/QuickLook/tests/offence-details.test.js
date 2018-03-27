import React from 'react';
import { shallow } from 'enzyme';
import { List } from 'immutable';

import { OffenceDetails } from '../index';

describe('Offence details component', () => {
  it('should display a message indicating that there are no offence details', () => {
    const offenceDetails = shallow(
      <OffenceDetails
        offences={List([])}
      />
     );

    expect(offenceDetails.contains(<div> No offence details are available at this time </div>)).toBe(true);
  })
});