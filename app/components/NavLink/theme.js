import styled from 'styled-components'
import { Link } from 'react-router'
import colours from 'theme/colours'
import { media } from 'utils/style-utils'

export const NavLinkLink = styled(Link)`
  font-size: 15px;
  color: ${colours.baseFont};
`

export const NavLinkWrapper = styled.div`
  padding-left: 15px;
  ${media.desktop`padding-left: 0;`} margin-right: auto;

  margin-top: 15px;
  ${media.desktop`margin-top: 0;`} margin-bottom: 0;

  width: 100%;
  max-width: 1170px;
`
