import React from 'react';
import { shallow } from 'enzyme';
import { Map } from 'immutable';
import DisplayValue from 'components/FormComponents/DisplayValue';
import { FormattedDate } from 'components/intl';
import { LastVisit, NextVisit, Visits } from '../index';

describe('Visits', () => {
  it('should let the user know when there are no last visit', () => {
    const component = shallow(<Visits lastVisit={Map({})} nextVisit={Map({})} />);
    expect(component.contains('No visit history.'));
  });

  it('should let the user know when there are no next visit', () => {
    const component = shallow(<Visits lastVisit={Map({})} nextVisit={Map({})} />);
    expect(component.contains('No upcoming visits.'));
  });

  it('should display provided details correctly for the last visit', () => {
    const component = shallow(
      <LastVisit
        date={'2018-01-25'}
        type={'Social Contact'}
        status={'Cancelled'}
        leadVisitor={'John Smith (Brother)'}
        cancellationReason={'No show'}
      />
    );

    expect(component.contains(<DisplayValue value={'Social Contact'} />)).toBe(true);
    expect(component.contains(<DisplayValue value={'Cancelled'} />)).toBe(true);
    expect(component.contains(<DisplayValue value={'John Smith (Brother)'} />)).toBe(true);
    expect(component.contains(<FormattedDate value={'2018-01-25'} />)).toBe(true);
    expect(component.contains('No show')).toBe(true);
  });

  it('should display provided details correctly for the next visit', () => {
    const component = shallow(
      <NextVisit
        date={'2018-01-25'}
        type={'Social Contact'}
        leadVisitor={'John Smith (Brother)'}
      />
    );

    expect(component.contains(<DisplayValue value={'Social Contact'} />)).toBe(true);
    expect(component.contains(<DisplayValue value={'John Smith (Brother)'} />)).toBe(true);
    expect(component.contains(<FormattedDate value={'2018-01-25'} />)).toBe(true);
  });

  it('should not display cancellation reason section if no cancellation reason is provided', () => {
    const component = shallow(
      <LastVisit
        date={'2018-01-25'}
        type={'Social Contact'}
        status={'Ongoing'}
        leadVisitor={'John Smith (Brother)'}
        cancellationReason={null}
      />
    );

    expect(component.contains(<DisplayValue value={'Social Contact'} />)).toBe(true);
    expect(component.contains(<DisplayValue value={'Ongoing'} />)).toBe(true);
    expect(component.contains(<DisplayValue value={'John Smith (Brother)'} />)).toBe(true);
    expect(component.contains(<FormattedDate value={'2018-01-25'} />)).toBe(true);
    expect(component.contains(<label>Reason</label>)).toBe(false);
  });

  it('should display missing lead visitor correctly for last visit', () => {
    const component = shallow(
      <LastVisit
        date={'2018-01-25'}
        type={'Social Contact'}
        status={'Attended'}
        leadVisitor={null}
        cancellationReason={null}
      />
    );

    expect(component.contains(<DisplayValue value={'Social Contact'} />)).toBe(true);
    expect(component.contains(<DisplayValue value={'Attended'} />)).toBe(true);
    expect(component.contains(<DisplayValue value={null} />)).toBe(true);
    expect(component.contains(<FormattedDate value={'2018-01-25'} />)).toBe(true);
    expect(component.contains('No show')).toBe(false);
  });

  it('should display missing lead visitor correctly for next visit', () => {
    const component = shallow(
      <LastVisit
        date={'2018-01-25'}
        type={'Social Contact'}
        leadVisitor={null}
      />
    );

    expect(component.contains(<DisplayValue value={'Social Contact'} />)).toBe(true);
    expect(component.contains(<DisplayValue value={null} />)).toBe(true);
    expect(component.contains(<FormattedDate value={'2018-01-25'} />)).toBe(true);
  });
});