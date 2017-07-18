import styled from 'styled-components';
import { media } from 'utils/style-utils';

export const MobileOnly = styled.div`
  ${media.desktop`display: none;`}
`;

export const DesktopOnly = styled.div`
  display: none;
  
  ${media.desktop`
    display: initial;
    height: 100%;
  `}
`;
