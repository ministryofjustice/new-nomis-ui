import styled from 'styled-components';
import InlineSVG from 'react-svg-inline';
import colours from 'theme/colours';

export const IconSVG = styled(InlineSVG)`
  width: 23px;
  float: right;
  margin-top: 2px;

  svg {
    display: block;
    fill: inherit;
  }
`;

export const ToggleButtonContent = styled.div`
  width: 68px;
  margin: auto;
  margin-top: 3px;
`;

export const ToggleButton = styled.div`
  width: 50%;
  float: left;
  margin-top: 0px;
  font-size: 20px;
  
  &:last-child {
    border-left: 1px solid grey;
  }
`;

export const ToggleComponent = styled.div`
  width: 100%;
  height: 100%;
`;

export const ToggleContainer = styled.div`
  position: relative;
  border: 1px solid ${colours.userMenu.bg};
  border-radius: 8px;
  overflow: hidden;
  margin: 10px;
`;
