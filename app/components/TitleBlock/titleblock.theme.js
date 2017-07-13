import styled from 'styled-components';
import colours from 'theme/colours';

export const Wrapper = styled.div`
  color: ${colours.baseFont};
  text-align: center;
  padding: 0 20px;
  margin-bottom: 35px;
`;

export const LeftWrapper = styled.div`
  color: ${colours.baseFont};
  text-align: left;
  padding: 0 20px;
  margin-bottom: 35px;
`;

export const Title = styled.div`
  margin-top: 20px;
  font-weight: bold;
  font-size: 48px;
`;

export const Subtitle = styled.div`
  font-weight: normal;
  font-size: 24px;
`;
