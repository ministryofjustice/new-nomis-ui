import styled from 'styled-components';
import InlineSVG from 'react-svg-inline';
import colours from 'theme/colours';

export const IconSVG = styled(InlineSVG)`
  display: block;
  width: 40px;
  float: right;
  margin-top: 11px;

  svg {
    display: block;
    position: relative;
    width: 100%;
    fill: inherit;
  }
`;

export const ToggleButtonContent = styled.div`
  width: 128px;
  height: 36px;
  margin: auto;
  margin-top: 9px;
`;

export const ToggleButton = styled.div`
  width: 50%;
  height: 100%;
  float: left;
  margin-top: 0px;
  padding: 0px 16px;
  font-size: 40px;
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
  width: calc(100% - 40px);
  height: 80px;
  margin: 20px;
  border: 3px solid ${colours.userMenu.bg};
  border-radius: 16px;
  overflow: hidden;
`;
