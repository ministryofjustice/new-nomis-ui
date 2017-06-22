import styled from 'styled-components';
import colours from 'theme/colours';
import { Link } from 'react-router';

export const MenuWrapper = styled.div`
  align-items: center;
  background: ${colours.userMenu.bg};
  display: flex;
  height: 100%;
  width: 269px;
  position: relative;
`;

export const UserName = styled.strong`
  position: relative;
  padding: 0 10px 0 0px;
  border-right: solid white 1px;
  font-size: 19px;
  margin-left: auto;
`;

export const CaseLoad = styled.span`
  padding: 0 18px 0 10px;
  font-size: 19px;
  margin-right: auto;
`;

export const DropdownMenu = styled.div`
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 1000;
`;

export const DropdownMenuOption = styled.a`
  box-sizing: border-box;
  color: rgba(51, 51, 51, 0.8);
  cursor: pointer;
  display: block;
  padding: 16px 10px;
  background: ${colours.userMenu.bg};
  color: white;
  font-size: 19px;
  align-items: center;
  text-align: center;
  border-top: 1px solid lightblue;
  height: 60px;
  text-decoration: none;
  &:hover{
    background: ${colours.userMenu.hover};
  }
`;

export const DropdownMenuLink = styled(Link)`
  box-sizing: border-box;
  color: rgba(51, 51, 51, 0.8);
  cursor: pointer;
  display: block;
  padding: 16px 10px;
  background: ${colours.userMenu.bg};
  color: white;
  font-size: 19px;
  align-items: center;
  text-align: center;
  border-top: 1px solid lightblue;
  height: 60px;
  text-decoration: none;
  &:hover{
    background: ${colours.userMenu.hover};
  }
`;

export const DropdownMenuOptionLogOut = styled(DropdownMenuOption)`
  background: ${colours.userMenu.logout};
`;

export const NotificationNumber = styled.div`
  height: 20px;
  width: 20px;
  margin: auto;
  text-align: center;
  line-height: 22px;
  border-radius: 10px;
  background-color: ${colours.userMenu.notification};
  color: black;
  font-size: 12px;
`;

export const NotificationNumberUser = styled(NotificationNumber)`
  position: absolute;
  top: -9px;
  left: -15px;
`;

export const NotificationNumberAssignments = styled(NotificationNumber)`
  position: relative;
  top: -2px;
  left: 4px;
  display: inline;
  padding: 2px 5px;
  font-weight: bold;
`;
