import styled from 'styled-components';
import { mfmedia } from 'utils/style-utils';

export const MobileOnly = styled.div`
  ${mfmedia.desktop`display: none;`}
`;

export const DesktopOnly = styled.div`
  display: none;
  
  ${mfmedia.desktop`
    display: initial;
    height: 100%;
  `}
`;
