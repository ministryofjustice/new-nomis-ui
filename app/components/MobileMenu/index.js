import React from 'react';
import PropTypes from 'prop-types';

import { MobileMenuContainer,
         MobileMenuHeader,
         MobileMenuOption,
         MobileMenuAdditionalOption,
         MobileMenuSignature,
         UserName,
         CaseLoad,
         NotificationNumberAssignments,
         ForwardArrow,
       } from './theme';

import forwardBack from '../../assets/forward-arrow.svg';

function MobileMenu({ user, options }) {
  return (
    <MobileMenuContainer>
      <MobileMenuHeader>
        <UserName>{user.firstName}</UserName>
        <CaseLoad>{user.activeCaseLoadId}</CaseLoad>
      </MobileMenuHeader>
      <MobileMenuOption>Search<ForwardArrow svg={forwardBack} /></MobileMenuOption>
      <MobileMenuOption>
        My Assignments
        <NotificationNumberAssignments>
          {options.assignments}
        </NotificationNumberAssignments>
        <ForwardArrow svg={forwardBack} />
      </MobileMenuOption>
      {options.facilities.map((option) => {
        const newObj = <MobileMenuOption key={option} data-id={'dropdown-option'}>{option}<ForwardArrow svg={forwardBack} /></MobileMenuOption>;
        return newObj;
      })}
      <MobileMenuOption key={'logout'} href={'/logout'} data-id={'dropdown-option'}>Log out<ForwardArrow svg={forwardBack} /></MobileMenuOption>
      <MobileMenuAdditionalOption>Updates</MobileMenuAdditionalOption>
      <MobileMenuAdditionalOption>Help</MobileMenuAdditionalOption>
      <MobileMenuAdditionalOption>Terms and conditions</MobileMenuAdditionalOption>
      <MobileMenuSignature>Powered By Syscon</MobileMenuSignature>
    </MobileMenuContainer>
  );
}

MobileMenu.propTypes = {
  user: PropTypes.object,
  options: PropTypes.object,
};

MobileMenu.defaultProps = {
  user: {
    firstName: 'first',
    activeCaseLoadId: 'id',
  },
  options: {
    assignments: 12,
    facilities: ['Sheffield', 'Cloverfield'],
  },
};

export default MobileMenu;
