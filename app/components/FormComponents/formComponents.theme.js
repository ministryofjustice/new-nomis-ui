import styled from 'styled-components';
import fonts from 'theme/fonts';
import colours from 'theme/colours';
import { media } from '../../utils/style-utils';

export const SubmissionError = styled.div`
  border: 5px solid ${colours.forms.errorColour};
  padding: ${({ error }) => error ? '15' : '30'}px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
  width: 95vw;
  max-width: 1170px;

  ${media.mobile`border: 4px solid ${colours.forms.errorColour};`}
  ${media.mobile`padding: 15px 10px;`}
  ${media.mobile`font-size: 20px;`}
  ${media.mobile`line-height: 1.2;`}
  ${media.mobile`width: auto;`}
  
  visibility: ${({ error }) => error ? 'visible' : 'hidden'}
  ${fonts.misc}
  transition: height 0.5s;
`;
