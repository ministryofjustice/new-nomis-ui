import styled from 'styled-components'

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
  height: 3px;
  width: 100%;
  border-radius: 1.5px;
  opacity: 1;
  left: 0;
  box-sizing: border-box;
  background: #000;
`

export const SlashLeft = styled(Slash)`
  transform: rotate(-45deg);
`

export const SlashRight = styled(Slash)`
  transform: rotate(45deg);
`
