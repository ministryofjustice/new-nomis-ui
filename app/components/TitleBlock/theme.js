import styled from 'styled-components'
import colours from 'theme/colours'
import { media } from 'utils/style-utils'

export const Wrapper = styled.div`
  color: ${colours.baseFont};
  text-align: left;
  margin-bottom: 20px;
`

// Title wrapper that is always left-aligned.
export const LeftWrapper = styled(Wrapper)`
  text-align: left !important;
`

// Title wrapper that is always right-aligned.
export const RightWrapper = styled(Wrapper)`
  text-align: right !important;
`

// Title wrapper that is always center-aligned.
export const CenterWrapper = styled(Wrapper)`
  text-align: center !important;
`

export const Title = styled.div`
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  ${media.desktop`
    font-size: 36px;
  `};
`

export const Subtitle = styled.div`
  font-weight: normal;
  font-size: 12px;

  ${media.desktop`
    font-size: 24px;
  `};
`
