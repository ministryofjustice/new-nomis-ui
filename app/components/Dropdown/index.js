import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toFullName } from 'utils/stringUtils';

import { MenuWrapper,
         InfoWrapper,
         UserName,
         CaseLoad,
         DropdownMenu,
         DropdownMenuOption,
         DropdownMenuOptionLogOut,
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
    this.mounted = true;
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener('mousedown', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, false);
  }

  handleMouseDown(event) {
    if (event.target.dataset.id === 'dropdown-option') return;
    if (event.type === 'mousedown' && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  handleDocumentClick(event) {
    if (this.mounted) {
      if (!this.wrapper.contains(event.target)) {
        this.setState({ isOpen: false });
      }
    }
  }

  render() {
    const { user, switchCaseLoad } = this.props;
    let dropDownSelections = [];
    dropDownSelections.push(<DropdownMenuLink key={'My Assignments'} to={'/assignments'} data-id={'dropdown-option'}>My Assignments <NotificationNumberAssignments>{user.totalAssignments}</NotificationNumberAssignments></DropdownMenuLink>);
    const facilityArray = user.caseLoadOptions.map((option) => {
      const newObj = <DropdownMenuOption key={option.caseLoadId} onClick={() => { switchCaseLoad(option.caseLoadId); }} data-id={'dropdown-option'}>{option.description}</DropdownMenuOption>;
      return newObj;
    });
    dropDownSelections = dropDownSelections.concat(facilityArray);
    dropDownSelections.push(<DropdownMenuOptionLogOut key={'logout'} href={'/logout'} data-id={'dropdown-option'}>Log out</DropdownMenuOptionLogOut>);
    const caseLoadDesc = user.activeCaseLoad && user.activeCaseLoad.description ? user.activeCaseLoad.description : user.activeCaseLoadId;

    return (
      <MenuWrapper innerRef={(wrapper) => { this.wrapper = wrapper; }} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown}>
        <InfoWrapper data-name={'InfoWrapper'}>
          <UserName>{toFullName(user)}
            <NotificationNumberUser>{user.totalAssignments}</NotificationNumberUser>
          </UserName>
          <CaseLoad>{caseLoadDesc}</CaseLoad>
        </InfoWrapper>
        <DropdownMenu>
          { this.state.isOpen ? dropDownSelections : null }
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
