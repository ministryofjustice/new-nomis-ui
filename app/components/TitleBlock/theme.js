import styled from 'styled-components';
import colours from 'theme/colours';
import { mfmedia } from 'utils/style-utils';

// Mobile first, responsive title wrapper. Center-aligned by default, left-aligned on desktop.
export const Wrapper = styled.div`
  color: ${colours.baseFont};
  text-align: center;
  padding: 0 20px;
  margin-bottom: 20px;

  ${mfmedia.desktop`
    text-align: left;
  `}
`;

// Title wrapper that is always left-aligned.
export const LeftWrapper = styled(Wrapper)`
  text-align: left !important;
`;

// Title wrapper that is always right-aligned.
export const RightWrapper = styled(Wrapper)`
  text-align: right !important;
`;

// Title wrapper that is always center-aligned.
export const CenterWrapper = styled(Wrapper)`
  text-align: center !important;
`;

export const Title = styled.div`
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  
  ${mfmedia.desktop`
    font-size: 48px;
  `}
`;

export const Subtitle = styled.div`
  font-weight: normal;
  font-size: 12px;

  ${mfmedia.desktop`
    font-size: 24px;
  `}
`;
