import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MenuWrapper,
         UserName,
         CaseLoad,
         DropdownMenu,
         DropdownMenuOption,
         DropdownMenuOptionLogOut,
         NotificationNumberUser,
         NotificationNumberAssignments,
       } from './theme';

class Dropdown extends Component {

  static propTypes = {
    user: PropTypes.object,
    options: PropTypes.object,
  };

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
    const { user, options } = this.props;

    let dropDownSelections = [];
    dropDownSelections.push(<DropdownMenuOption key={'My Assignments'} data-id={'dropdown-option'}>My Assignments <NotificationNumberAssignments>{options.assignments}</NotificationNumberAssignments></DropdownMenuOption>);
    const facilityArray = options.facilities.map((option) => {
      const newObj = <DropdownMenuOption key={option} data-id={'dropdown-option'}>{option}</DropdownMenuOption>;
      return newObj;
    });
    dropDownSelections = dropDownSelections.concat(facilityArray);
    dropDownSelections.push(<DropdownMenuOptionLogOut key={'logout'} href={'/logout'} data-id={'dropdown-option'}>Log out</DropdownMenuOptionLogOut>);

    return (
      <MenuWrapper innerRef={(wrapper) => { this.wrapper = wrapper; }} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown}>
        <UserName>{user.firstName}<NotificationNumberUser>{options.assignments}</NotificationNumberUser></UserName><CaseLoad>{user.activeCaseLoadId}</CaseLoad>
        <DropdownMenu>
          { this.state.isOpen ? dropDownSelections : null }
        </DropdownMenu>
      </MenuWrapper>
    );
  }

}

Dropdown.defaultProps = {
  user: {
    firstName: 'first',
    activeCaseLoadId: 'id',
  },
  options: {
    assignments: 12,
    facilities: ['Sheffield', 'Cloverfield'],
  },
};
export default Dropdown;
