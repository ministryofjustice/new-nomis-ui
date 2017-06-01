import styled from 'styled-components';
import desktop from 'theme/desktop';

const base = `
  margin: auto;
  width: 100%;
  max-width: ${desktop.fixWidth}px;`;

export const CenteredFlexColumn = styled.div`
  ${base}
  min-height: calc(100vh - ${desktop.footerHeight}px - ${desktop.headerHeight}px);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
