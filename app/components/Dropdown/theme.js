import styled from 'styled-components';
import colours from 'theme/colours';
import { Link } from 'react-router';

export const MenuWrapper = styled.div`
  align-items: center;
  background: ${colours.userMenu.bg};
  display: flex;
  height: 100%;
  min-width: 269px;
  position: relative;
`;

export const InfoWrapper = styled.div`
  padding-left: 26px;
  padding-right: 26px;
  width: 100%;
  align-items: center;
  display: flex;
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
  left: 0;
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
  align-items: left;
  text-align: left;
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
  align-items: left;
  text-align: left;
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