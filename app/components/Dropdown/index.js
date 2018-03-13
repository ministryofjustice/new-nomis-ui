import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toFullName } from 'utils/stringUtils';
import { MenuWrapper,
         InfoWrapper,
         UserName,
         CaseLoad,
         DropdownMenu,
         DropdownMenuOption,
         NotificationNumberUser,
         NotificationNumberAssignments,
         DropdownMenuLink,
       } from './theme';

class Dropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.closeMenu = this.closeMenu.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  closeMenu() {
    this.setState({ isOpen: false });
  }
  toggleMenu() {
    this.setState({ isOpen: !this.state.isOpen });
  }
  render() {
    const { user, switchCaseLoad } = this.props;
    const caseLoadDesc = user.activeCaseLoad && user.activeCaseLoad.description ? user.activeCaseLoad.description : user.activeCaseLoadId;

    return (
      <MenuWrapper innerRef={(wrapper) => { this.wrapper = wrapper; }} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown}>
        <InfoWrapper className="clickable" onClick={() => this.toggleMenu()}>
          <UserName>{toFullName(user)}
            <NotificationNumberUser>{user.totalAssignments}</NotificationNumberUser>
          </UserName>
          <CaseLoad>{caseLoadDesc}</CaseLoad>
        </InfoWrapper>
        <DropdownMenu>
          { this.state.isOpen &&
          <div>
            <DropdownMenuLink key={'My Assignments'} to={'/assignments'} onClick={() => this.toggleMenu()}>
              My Assignments
              <NotificationNumberAssignments>{user.totalAssignments}</NotificationNumberAssignments>
            </DropdownMenuLink>

            {user.caseLoadOptions.map((option) =>
              <DropdownMenuOption key={option.caseLoadId} onClick={() => { this.closeMenu(); switchCaseLoad(option.caseLoadId); }}>
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
};

Dropdown.defaultProps = {
  user: {
    firstName: 'first',
    activeCaseLoadId: 'id',
  },
};

export default Dropdown;
