import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toFullName } from 'utils/stringUtils';
import { MenuWrapper,
         InfoWrapper,
         UserName,
         CaseLoad,
         DropdownMenu,
         DropdownMenuOption,
         DropdownMenuLink,
       } from './theme';

class Dropdown extends Component {

  render() {
    const { user, switchCaseLoad, menuOpen, toggleMenu } = this.props;
  
    const caseLoadDesc = user.activeCaseLoad && user.activeCaseLoad.description ? user.activeCaseLoad.description : user.activeCaseLoadId;

    return (
      <MenuWrapper innerRef={(wrapper) => { this.wrapper = wrapper; }} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown}>
        <InfoWrapper className="clickable" onClick={() => toggleMenu()}>
          <UserName>{toFullName(user)}
          </UserName>
          <CaseLoad>{caseLoadDesc}</CaseLoad>
        </InfoWrapper>
        <DropdownMenu>
          { menuOpen &&
          <div>
            {user.isKeyWorker && 
            <DropdownMenuLink className="my-allocations-menu-link" key={'My Assignments'} to={'/myKeyWorkerAllocations'} onClick={() => toggleMenu()}>
              My key worker allocations
            </DropdownMenuLink>}

            {user.caseLoadOptions.map((option) =>
              <DropdownMenuOption key={option.caseLoadId} onClick={() => { switchCaseLoad(option.caseLoadId); toggleMenu(); }}>
                {option.description}
              </DropdownMenuOption>)
            }

            <DropdownMenuLink key={'logout'} href={'/logout'}>
              Log out
            </DropdownMenuLink>

          </div> }
        </DropdownMenu>
      </MenuWrapper>
    );
  }
}

Dropdown.propTypes = {
  user: PropTypes.object,
  switchCaseLoad: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

Dropdown.defaultProps = {
  user: {
    firstName: 'first',
    activeCaseLoadId: 'id',
  },
};

export default Dropdown;
