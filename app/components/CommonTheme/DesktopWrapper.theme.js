import styled from 'styled-components';
// import colors from 'theme/colors';
// import fonts from 'theme/fonts';

export const Outer = styled.div`
  background:  ${(props) => props.background || 'white'};
`;

export const Inner = styled.div`
  max-width: 1170px;
  margin: 0 auto;
`;
