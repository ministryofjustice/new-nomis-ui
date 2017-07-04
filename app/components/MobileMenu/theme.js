import styled from 'styled-components';
import colours from 'theme/colours';
import InlineSVG from 'react-svg-inline';
import { Link } from 'react-router';

export const MobileMenuContainer = styled.div`
  position: absolute;
  top: 90px;
  left: 0;
  width: 100%;
  height: calc(100% - 90px)
  padding-bottom: 6px;
  background: ${colours.userMenu.bg};
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

export const MobileMenuHeader = styled.div`
  height: 230px;
  border-bottom: 1px solid lightblue;
`;

export const UserName = styled.strong`
  position: absolute;
  top: 55px;
  left: 50px;
  font-size: 50px;
  color: white;
`;

export const CaseLoad = styled.span`
  position: relative;
  top: 122px;
  left: 55px;
  font-size: 40px;
  color: white;
`;

export const NotificationNumber = styled.div`
  height: 56px;
  width: 56px;
  margin: auto;
  text-align: center;
  line-height: 22px;
  border-radius: 28px;
  background-color: ${colours.userMenu.notification};
  color: #0b0c0c;
  font-size: 32px;
`;

export const NotificationNumberAssignments = styled(NotificationNumber)`
  position: relative;
  top: -2px;
  left: 20px;
  display: inline;
  padding: 8px 13px 4px;
  font-weight: bold;
`;

export const MobileMenuOption = styled(Link)`
  position: relative;
  box-sizing: border-box;
  color: rgba(51, 51, 51, 0.8);
  cursor: pointer;
  display: block;
  padding: 35px 60px;
  background: ${colours.userMenu.bg};
  color: white;
  font-size: 36px;
  align-items: center;
  text-align: left;
  border-bottom: 1px solid lightblue;
  height: 130px;
  text-decoration: none;
  &:hover{
    background: ${colours.userMenu.hover};
  }
`;

export const MobileMenuAdditionalOption = styled(Link)`
  box-sizing: border-box;
  color: rgba(51, 51, 51, 0.8);
  cursor: pointer;
  display: block;
  padding: 30px 60px 10px;
  background: ${colours.userMenu.bg};
  color: white;
  font-size: 36px;
  align-items: center;
  text-align: left;
  height: 130px;
  text-decoration: none;
  &:hover{
    background: ${colours.userMenu.hover};
  }
`;

export const MobileMenuSignature = styled.div`
  box-sizing: border-box;
  color: rgba(51, 51, 51, 0.8);
  cursor: pointer;
  display: block;
  padding: 16px 60px;
  background: ${colours.userMenu.bg};
  color: white;
  opacity: 0.6;
  font-size: 36px;
  align-items: center;
  text-align: left;
  height: 130px;
  text-decoration: none;
  &:hover{
    background: ${colours.userMenu.hover};
  }
`;

export const ForwardArrow = styled(InlineSVG)`
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  padding: 47px 78px;
  width: 20px;
  height: 30px;
  svg {
    display: block;

    width: 20px;
    height: 30px;
    fill: inherit;
  }
`;
