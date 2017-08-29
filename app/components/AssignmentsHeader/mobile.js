import React from 'react';
import PropTypes from 'prop-types';
import { toFullName } from 'utils/stringUtils';

import { AssignmentsHeaderWrapper,
  PortraitImage,
  UserName,
  CaseLoad,
  YouHaveAssignments,
  NotificationNumberAssignments,
} from './mobile.theme';

function AssignmentsHeaderMobile({ user, options }) {
  return (
    <AssignmentsHeaderWrapper>
      <PortraitImage background={'/img/assignmentsHeader-missing-portrait-mobile.png'} />
      <UserName>{toFullName(user)}</UserName>
      <CaseLoad>{user.activeCaseLoadId}</CaseLoad>
      <YouHaveAssignments><NotificationNumberAssignments>{options.assignments}</NotificationNumberAssignments> Assignments</YouHaveAssignments>
    </AssignmentsHeaderWrapper>
  );
}

AssignmentsHeaderMobile.propTypes = {
  user: PropTypes.object,
  options: PropTypes.object,
};

AssignmentsHeaderMobile.defaultProps = {
  user: {
    firstName: 'first',
    activeCaseLoadId: 'id',
  },
  options: {
    assignments: 12,
    facilities: ['Sheffield', 'Cloverfield'],
  },
};

export default AssignmentsHeaderMobile;
