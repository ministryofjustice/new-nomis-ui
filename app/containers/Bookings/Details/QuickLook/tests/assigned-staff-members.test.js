import React from 'react';
import { shallow } from 'enzyme';
import each from 'jest-each';
import { AssignedStaffMembers } from '../index';

describe('<AssignedStaffMembers />', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<AssignedStaffMembers />);
  })

  describe('when there are no staff members', () => {
    it('should display a message indicating that there are no assigned staff members', () => {
      expect(wrapper.contains('No assigned staff members')).toBe(true);
    });
  })

  describe('when there are staff members', () => {
    it('should render a Key Worker label and value', () => {
      const staffId = 12345
      wrapper.setProps({ keyWorkerId: staffId })
      expect(wrapper.find('ValueWithLabel').prop('label')).toEqual('Key Worker');
      expect(wrapper.find('Connect(EliteOfficerName)').prop('staffId')).toEqual(staffId);
    });

    const staffDetails = new Map([['firstName', 'Test'], ['lastName', 'User']]);
    
    each`
      propName                      | propValue        | staffRole
      ${'communityOffenderManager'} | ${staffDetails}  | ${'Community Offender Manager'}
      ${'offenderSupervisor'}       | ${staffDetails}  | ${'Offender Supervisor'}
      ${'caseAdministrator'}        | ${staffDetails}  | ${'Case Administrator'}
      ${'drugWorker'}               | ${staffDetails}  | ${'Drug Worker'}
    `.it('should render a $staffRole label and value', ({ propName, propValue, staffRole }) => {
      wrapper.setProps({ [propName]: propValue });
      expect(wrapper.find('ValueWithLabel').prop('label')).toEqual(staffRole);
      expect(wrapper.find('ValueWithLabel').prop('children')).toEqual('User, Test');
    });
  });
});
