import styled from 'styled-components'
import fonts from 'theme/fonts'
import colours from 'theme/colours'
import { media } from 'utils/style-utils'

export const SubmissionError = styled.div`
  border: 4px solid ${colours.forms.errorColour};
  padding: 15px 10px;
  padding: ${({ error }) => (error ? '15' : '0')}px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  width: auto;
  max-width: 1170px;

  ${media.desktop`border: 5px solid ${colours.forms.errorColour};`}
  ${media.desktop`${({ error }) => (error ? '15' : '30')}px;`}
  ${media.desktop`font-size: 24px;`}
  ${media.desktop`line-height: 1.25;`}
  ${media.desktop`width: 95vw;`}
  
  visibility: ${({ error }) => (error ? 'visible' : 'hidden')}
  ${fonts.misc}
  transition: height 0.5s;
`
