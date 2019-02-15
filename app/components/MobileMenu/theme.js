import styled from 'styled-components'
import InlineSVG from 'react-svg-inline'
import colours from '../../theme/colours'

export const MobileMenuContainer = styled.div`
  background: ${colours.userMenu.bg};
  overflow: scroll;

  &::-webkit-scrollbar {
    width: 0px;
  }
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
`

export const MobileMenuHeader = styled.div`
  color: ${colours.userMenu.text};
  border-bottom: 1px solid lightblue;
  padding: 20px 30px;
`

export const UserName = styled.strong`
  font-size: 26px;
`

export const CaseLoad = styled.div`
  font-size: 20px;
`

export const NotificationNumber = styled.div`
  height: 56px;
  width: 56px;
  margin: auto;
  text-align: center;
  line-height: 22px;
  border-radius: 28px;
  background-color: ${colours.userMenu.notification};
  color: ${colours.baseFont};
  font-size: 16px;
`

export const NotificationNumberAssignments = styled(NotificationNumber)`
  position: relative;
  top: -2px;
  left: 20px;
  display: inline;
  padding: 7px 8px 4px 7px;
  font-weight: bold;
`

export const MobileMenuOption = styled.div`
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  padding: 20px 30px;
  color: ${colours.userMenu.text};
  font-size: 18px;
  border-bottom: 1px solid lightblue;
  text-decoration: none;

  &:hover {
    background: ${colours.userMenu.hover};
  }
`

export const MobileMenuSignature = styled.div`
  box-sizing: border-box;
  cursor: default;
  display: block;
  padding: 20px 20px 5px 30px;
  color: ${colours.userMenu.text};
  opacity: 0.6;
  font-size: 14px;
  text-decoration: none;
  text-align: center;
`

export const ForwardArrow = styled(InlineSVG)`
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  padding: 22px 50px;
  width: 20px;
  height: 30px;

  svg {
    display: block;
    width: 10px;
    height: 26px;
    fill: inherit;
  }
`
