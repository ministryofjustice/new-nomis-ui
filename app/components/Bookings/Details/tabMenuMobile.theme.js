import styled from 'styled-components';
import colours from 'theme/colours';

const mobileTabNav = colours.bookings.details.mobileTabNav.buttonBackground;

export const TabWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 800;
  
  div {
    padding: 25px 0px 2px;
  }
`;

export const TabWrapperContentPadding = styled.div`
  width: 100%;
  display: flex;
`;

export const TabMenuItem = styled.div`
  width: 25%;
  flex-grow: 1;
  color: white;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;

  border-right: #F8F8F8 1px solid;

  &:last-child {
    border-right: 2px;
  }

  cursor: ${({ active }) => active ? 'normal' : 'pointer'};
  background-image: url('${({ bgImg }) => bgImg}');
  background-color: ${({ active }) => active ? mobileTabNav : colours.baseFont};
  background-repeat: no-repeat;
  background-position: 50% 28%;  
`;


export const TextHolder = styled.div`
  font-size: 14px;
`;
