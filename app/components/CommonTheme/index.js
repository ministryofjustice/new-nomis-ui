import styled from 'styled-components'
import { media } from '../../utils/style-utils'

export const MobileOnly = styled.div`
  ${media.desktop`display: none;`};
`

// IE11 does not recognise display 'initial'
export const DesktopOnly = styled.div`
  display: none;

  ${media.desktop`
    display: block;
    height: 100%;
  `};
`

export const LoadingMessage = styled.div`
  margin-top: 10px;
`
