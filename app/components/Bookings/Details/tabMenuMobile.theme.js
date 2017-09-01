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
  font-size: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;

  border-right: #303030 1px solid;

  &:last-child {
    border-right: 2px;
  }

  cursor: ${({ active }) => active ? 'normal' : 'pointer'};
  background-image: url('${({ bgImg }) => bgImg}');
  background-color: ${({ active }) => active ? mobileTabNav : colours.baseFont};
  background-repeat: no-repeat;
  background-position: 50% 23%;
  
  @media
    only screen and (-webkit-min-device-pixel-ratio: 2),
    only screen and (   min--moz-device-pixel-ratio: 2),
    only screen and (     -o-min-device-pixel-ratio: 2/1),
    only screen and (        min-device-pixel-ratio: 2),
    only screen and (                min-resolution: 192dpi),
    only screen and (                min-resolution: 2dppx) {
      background-image: url('${({ retinaBgImg }) => retinaBgImg}');
      background-size: 36%;
      
      &:first-child {
        background-size: 60%;
      }
    }
`;

export const TextHolder = styled.div`
  font-size: 15px;
`;
