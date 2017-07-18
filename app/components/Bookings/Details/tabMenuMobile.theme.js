import styled from 'styled-components';
import colours from 'theme/colours';

const mobileTabNav = colours.bookings.details.mobileTabNav.buttonBackground;

export const TabWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  position: fixed;
  bottom: 0;

  div {
    padding: 23px 0px 0px;
  }
`;

export const TabWrapperContentPadding = styled.div`
  width: 100%;
  display: flex;
`;

export const TabMenuItem = styled.div`
  flex-grow: 1;
  color: white;
  text-align: center;
  font-size: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;

  border-right: #303030 1px solid;

  &:last-child {
    border-right: 0px;
  }

  cursor: ${({ active }) => active ? 'normal' : 'pointer'};
  background-image: url('${({ bgImg }) => bgImg}');
  background-color: ${({ active }) => active ? mobileTabNav : colours.baseFont};
  background-repeat: no-repeat;
  background-position: 50% 23%;
`;

export const TextHolder = styled.div`
  width: 89px;
`;
