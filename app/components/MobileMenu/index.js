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

function MobileMenu({ user, modalData, setMobileMenuOpen, setModalData, switchCaseLoad }) {
  const linkClick = (e) => {
    setModalData(modalData[e.currentTarget.dataset.name]);
    removeMobileMenu();
  };

  const removeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const caseLoadDesc = user.activeCaseLoad && user.activeCaseLoad.description ? user.activeCaseLoad.description : user.activeCaseLoadId;

  return (
    <MobileMenuContainer>
      <MobileMenuHeader>
        <UserName>{user.lastName[0].toUpperCase() + user.lastName.toLowerCase().slice(1)}, {user.firstName[0].toUpperCase() + user.firstName.toLowerCase().slice(1)}</UserName>
        <CaseLoad>{caseLoadDesc}</CaseLoad>
      </MobileMenuHeader>
      <MobileMenuOption to={'/search'} onClick={removeMobileMenu}>Search<ForwardArrow svg={forwardBack} /></MobileMenuOption>
      <MobileMenuOption to={'/assignments'}>
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
      <MobileMenuOption key={'logout'} to={'/logout'} data-id={'dropdown-option'} onClick={removeMobileMenu}>Log out<ForwardArrow svg={forwardBack} /></MobileMenuOption>
      <MobileMenuAdditionalOption data-name={'updates'} to={'/modalMobile'} onClick={linkClick}>Updates</MobileMenuAdditionalOption>
      <MobileMenuAdditionalOption data-name={'help'} to={'/modalMobile'} onClick={linkClick}>Help</MobileMenuAdditionalOption>
      <MobileMenuAdditionalOption data-name={'terms'} to={'/modalMobile'} onClick={linkClick}>Terms and conditions</MobileMenuAdditionalOption>
      <MobileMenuSignature>Powered By Syscon</MobileMenuSignature>
    </MobileMenuContainer>
  );
}

MobileMenu.propTypes = {
  user: PropTypes.object,
  modalData: PropTypes.object.isRequired,
  setMobileMenuOpen: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
  switchCaseLoad: PropTypes.func.isRequired,
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
