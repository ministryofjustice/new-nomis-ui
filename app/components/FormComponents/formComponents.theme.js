import styled from 'styled-components';
import fonts from 'theme/fonts';
import colours from 'theme/colours';

export const SubmissionError = styled.div`
  position: absolute;
  top: -25px;
  visibility: ${({ error }) => error ? 'visible' : 'hidden'}
  ${''/* height: ${({ error }) => error ? '22px' : '0px'} */}
  ${fonts.misc}
  color: ${colours.forms.errorColour};
  transition: height 0.5s;
`;
