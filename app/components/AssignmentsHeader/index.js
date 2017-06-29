import React from 'react';
import PropTypes from 'prop-types';

import { AssignmentsHeaderWrapper,
  PortraitImage,
  UserName,
  CaseLoad,
  // SwitchCaseLoad,
  YouHaveAssignments,
  NotificationNumberAssignments,
  ResultsViewToggleWrapper,
} from './theme';


function AssignmentsHeader({ user, options, resultsViewToggle }) {
  return (
    <AssignmentsHeaderWrapper>
      <PortraitImage background={'/img/assignmentsHeader-missing-portrait.png'} />
      <UserName>{user.lastName[0].toUpperCase() + user.lastName.toLowerCase().slice(1)}, {user.firstName[0].toUpperCase() + user.firstName.toLowerCase().slice(1)}</UserName>
      <CaseLoad>{user.activeCaseLoadId}</CaseLoad>{/* <SwitchCaseLoad>Switch Caseload</SwitchCaseLoad> */}
      <YouHaveAssignments>You have <NotificationNumberAssignments>{options.assignments}</NotificationNumberAssignments> Assignments</YouHaveAssignments>
      <ResultsViewToggleWrapper>{resultsViewToggle}</ResultsViewToggleWrapper>
    </AssignmentsHeaderWrapper>
  );
}

AssignmentsHeader.propTypes = {
  user: PropTypes.object,
  options: PropTypes.object,
  resultsViewToggle: PropTypes.object.isRequired,
};

AssignmentsHeader.defaultProps = {
  user: {
    firstName: 'first',
    activeCaseLoadId: 'id',
  },
  options: {
    assignments: 12,
    facilities: ['Sheffield', 'Cloverfield'],
  },
};

export default AssignmentsHeader;
