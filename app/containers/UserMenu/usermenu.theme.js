import styled from 'styled-components';
import colours from 'theme/colours';

export const MenuWrapper = styled.div`
  align-items: center;
  background: ${colours.userMenu.bg};
  display: flex;
  height: 100%;
  position: relative;
`;

export const UserName = styled.strong`
  padding: 0 10px 0 33px;
  border-right: solid white 1px;
  font-size: 19px;
`;

export const CaseLoad = styled.span`
  padding: 0 18px 0 10px;
  font-size: 19px;
`;
