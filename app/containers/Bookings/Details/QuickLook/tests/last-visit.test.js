import React from 'react';
import { shallow } from 'enzyme';
import DisplayValue from 'components/FormComponents/DisplayValue';
import { FormattedDate } from 'react-intl';
import { LastVisit } from '../index';

describe('Last visit component', () => {
  it('should display provided details correctly', () => {
    const component = shallow(<LastVisit date={'2018-01-25'} type={'Social Contact'} status={'Cancelled'} leadVisitor={'John Smith (Brother)'} cancellationReason={'No show'} />);

    expect(component.contains(<b> <DisplayValue value={'Social Contact'} /> </b>)).toBe(true);
    expect(component.contains(<b> <DisplayValue value={'Cancelled'} /> </b>)).toBe(true);
    expect(component.contains(<b> <DisplayValue value={'John Smith (Brother)'} /> </b>)).toBe(true);
    expect(component.contains(<b> <FormattedDate value={'2018-01-25'} /> </b>)).toBe(true);
    expect(component.contains(<b> No show </b>)).toBe(true);
  });

  it('should not display cancellation reason section if no cancellation reason is provided', () => {
    const component = shallow(<LastVisit date={'2018-01-25'} type={'Social Contact'} status={'Ongoing'} leadVisitor={'John Smith (Brother)'} cancellationReason={null} />);

    expect(component.contains(<b> <DisplayValue value={'Social Contact'} /> </b>)).toBe(true);
    expect(component.contains(<b> <DisplayValue value={'Ongoing'} /> </b>)).toBe(true);
    expect(component.contains(<b> <DisplayValue value={'John Smith (Brother)'} /> </b>)).toBe(true);
    expect(component.contains(<b> <FormattedDate value={'2018-01-25'} /> </b>)).toBe(true);
    expect(component.contains(<label>Reason</label>)).toBe(false);
  });

  it('should display missing lead visitor correctly', () => {
    const component = shallow(<LastVisit date={'2018-01-25'} type={'Social Contact'} status={'Attended'} leadVisitor={null} cancellationReason={null} />);

    expect(component.contains(<b> <DisplayValue value={'Social Contact'} /> </b>)).toBe(true);
    expect(component.contains(<b> <DisplayValue value={'Attended'} /> </b>)).toBe(true);
    expect(component.contains(<b> <DisplayValue value={null} /> </b>)).toBe(true);
    expect(component.contains(<b> <FormattedDate value={'2018-01-25'} /> </b>)).toBe(true);
    expect(component.contains(<b> No show </b>)).toBe(false);
  });
});