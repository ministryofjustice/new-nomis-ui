import styled from 'styled-components'
import { baseColours } from '../../theme/colours'

export const Outer = styled.div`
  background: ${props => props.background || baseColours.govukWhite};
`

export const Inner = styled.div`
  max-width: 1170px;
  margin: 0 auto;
`
