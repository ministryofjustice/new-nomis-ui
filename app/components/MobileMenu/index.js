import React from 'react';
import PropTypes from 'prop-types';
import { toFullName } from 'utils/stringUtils';

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

function MobileMenu({ user, setMobileMenuOpen, showTerms, switchCaseLoad }) {
  const removeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <MobileMenuContainer>
      <MobileMenuHeader>
        <UserName>{toFullName(user)}</UserName>
        <CaseLoad>{user.activeCaseLoad && user.activeCaseLoad.description ? user.activeCaseLoad.description : user.activeCaseLoadId}</CaseLoad>
      </MobileMenuHeader>
      <MobileMenuOption to={'/'} onClick={removeMobileMenu}>Search<ForwardArrow svg={forwardBack} /></MobileMenuOption>
      <MobileMenuOption to={'/assignments'} onClick={removeMobileMenu}>
        My Assignments
        <NotificationNumberAssignments>
          {user.totalAssignments}
        </NotificationNumberAssignments>
        <ForwardArrow svg={forwardBack} />
      </MobileMenuOption>
      {user.caseLoadOptions.map((option) => {
        const newObj = <MobileMenuOption key={option.caseLoadId} onClick={() => { switchCaseLoad(option.caseLoadId); }} data-id={'dropdown-option'}>{option.description}<ForwardArrow svg={forwardBack} /></MobileMenuOption>;
        return newObj;
      })}
      <MobileMenuOption
        key={'logout'}
        href={'/logout'} data-id={'dropdown-option'}
      >
        Log out<ForwardArrow svg={forwardBack} />
      </MobileMenuOption>
      <MobileMenuAdditionalOption
        onClick={() => {
          setMobileMenuOpen(false);
          showTerms();
        }}
      >Terms and conditions</MobileMenuAdditionalOption>
      <MobileMenuSignature>Powered by Syscon Justice Systems</MobileMenuSignature>
    </MobileMenuContainer>
  );
}

MobileMenu.propTypes = {
  user: PropTypes.object,
  setMobileMenuOpen: PropTypes.func.isRequired,
  switchCaseLoad: PropTypes.func.isRequired,
};

MobileMenu.defaultProps = {
  user: undefined,
  options: {
    assignments: 12,
    facilities: ['Sheffield', 'Cloverfield'],
  },
};

export default MobileMenu;
