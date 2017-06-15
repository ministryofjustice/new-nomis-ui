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

function MobileMenu({ user, options, modalData, setMobileMenuOpen, setModalData }) {
  const linkClick = (e) => {
    setModalData(modalData[e.currentTarget.dataset.name]);
    removeMobileMenu();
  };

  const removeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <MobileMenuContainer>
      <MobileMenuHeader>
        <UserName>{user.firstName}</UserName>
        <CaseLoad>{user.activeCaseLoadId}</CaseLoad>
      </MobileMenuHeader>
      <MobileMenuOption to={'/search'} onClick={removeMobileMenu}>Search<ForwardArrow svg={forwardBack} /></MobileMenuOption>
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
      <MobileMenuOption key={'logout'} to={'/logout'} data-id={'dropdown-option'} onClick={removeMobileMenu}>Log out<ForwardArrow svg={forwardBack} /></MobileMenuOption>
      <MobileMenuAdditionalOption data-name={'updates'} to={'/modalMobile'} onClick={linkClick}>Updates</MobileMenuAdditionalOption>
      <MobileMenuAdditionalOption data-name={'help'} to={'/modalMobile'} onClick={linkClick}>Help</MobileMenuAdditionalOption>
      <MobileMenuAdditionalOption data-name={'terms'} to={'/modalMobile'} onClick={linkClick}>Terms and conditions</MobileMenuAdditionalOption>
      <MobileMenuAdditionalOption data-name={'cymraeg'} to={'/modalMobile'} onClick={linkClick}>Terms and conditions</MobileMenuAdditionalOption>
      <MobileMenuSignature>Powered By Syscon</MobileMenuSignature>
    </MobileMenuContainer>
  );
}

MobileMenu.propTypes = {
  user: PropTypes.object,
  options: PropTypes.object,
  modalData: PropTypes.object.isRequired,
  setMobileMenuOpen: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
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
