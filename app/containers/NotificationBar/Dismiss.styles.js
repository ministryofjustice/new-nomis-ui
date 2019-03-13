import styled from 'styled-components'
import { LIGHT_BLUE, YELLOW } from 'govuk-colours'

export const DismissBox = styled.div`
  width: 26px;
  height: 26px;
  cursor: pointer;
  position: relative;
  margin: 0;
  flex 0 0 26px;
`

const Slash = styled.span`
  top: 10px;
  display: block;
  position: absolute;
  height: 5px;
  width: 100%;
  border-radius: 5px;
  opacity: 1;
  left: 0;
  box-sizing: border-box;
  background: ${props => (props.type === 'Information' ? LIGHT_BLUE : YELLOW)};
`

export const SlashLeft = styled(Slash)`
  transform: rotate(-45deg);
`

export const SlashRight = styled(Slash)`
  transform: rotate(45deg);
`
