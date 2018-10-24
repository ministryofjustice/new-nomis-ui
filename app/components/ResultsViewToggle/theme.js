import styled from 'styled-components'
import InlineSVG from 'react-svg-inline'
// import colors from 'theme/colors';

export const IconSVG = styled(InlineSVG)`
  display: block;
  width: 20px;
  float: right;
  margin-top: 2px;

  svg {
    display: block;
    position: relative;
    width: 100%;
    fill: inherit;
  }
`

export const ToggleButton = styled.div`
  width: 91px;
  height: 20px;
  float: left;
  margin-top: 0px;
  padding: 0px 16px;
  &:last-child {
    border-left: 1px solid grey;
  }
`

export const ToggleComponent = styled.div`
  position: absolute;
  right: 0;
`

export const ToggleContainer = styled.div`
  position: relative;
  width: 100%;
  height: 30px;
`
