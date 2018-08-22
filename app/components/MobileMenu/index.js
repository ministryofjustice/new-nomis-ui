import React from 'react';
import PropTypes from 'prop-types';
import { toFullName } from 'utils/stringUtils';

import {
  MobileMenuContainer,
  MobileMenuHeader,
  MobileMenuOption,
  MobileMenuAdditionalOption,
  MobileMenuSignature,
  UserName,
  CaseLoad,
  ForwardArrow,
} from './theme';

import forwardBack from '../../assets/forward-arrow.svg';

function MobileMenu({ user, setMenuOpen, showTerms, switchCaseLoad }) {
  const removeMobileMenu = () => {
    setMenuOpen(false);
  };

  return (
    <MobileMenuContainer>
      <MobileMenuHeader>
        <UserName>{toFullName(user)}</UserName>
        <CaseLoad>{user.activeCaseLoad && user.activeCaseLoad.description ? user.activeCaseLoad.description : user.activeCaseLoadId}</CaseLoad>
      </MobileMenuHeader>
      <MobileMenuOption to={'/'} onClick={removeMobileMenu}>Search<ForwardArrow svg={forwardBack} /></MobileMenuOption>

       {user && user.isKeyWorker && <MobileMenuOption className="my-allocations-menu-link" to={'/myKeyWorkerAllocations'} onClick={removeMobileMenu}>
        My key worker allocations
        <ForwardArrow svg={forwardBack} />
      </MobileMenuOption> }

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
          setMenuOpen(false);
          showTerms();
        }}
      >Terms and conditions</MobileMenuAdditionalOption>
      <MobileMenuSignature></MobileMenuSignature>
    </MobileMenuContainer>
  );
}

MobileMenu.propTypes = {
  user: PropTypes.object,
  setMenuOpen: PropTypes.func.isRequired,
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
