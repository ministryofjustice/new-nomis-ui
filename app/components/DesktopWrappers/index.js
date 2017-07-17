import styled from 'styled-components';
import desktop from 'theme/desktop';

const base = `
  margin: auto;
  width: 100%;
  max-width: ${desktop.fixWidth}px;
`;

export const ContentWrapper = styled.div`
  ${base}
  display: flex;
  flex-direction: column;
  padding-bottom: ${desktop.footerHeight}px;
`;

export const CenteredContentWrapper = styled(ContentWrapper)`
  justify-content: center;
`;

export const DW = styled.div`
  ${base}
  min-height: calc(100vh - ${desktop.footerHeight}px - ${desktop.headerHeight}px - ${desktop.breadcrumbsHeight}px);
  display: flex;
  flex-direction: column;
`;

export const CenteredFlexColumnLogin = styled.div`
  ${base}
  min-height: calc(100vh - ${desktop.footerHeight}px - ${desktop.headerHeight}px);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const CenteredFlexColumn = styled.div`
  ${base}
  min-height: calc(100vh - ${desktop.footerHeight}px - ${desktop.headerHeight}px - ${desktop.breadcrumbsHeight}px);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const UpperFlexColumn = styled.div`
  ${base}
  min-height: calc(100vh - ${desktop.footerHeight}px - ${desktop.headerHeight}px - ${desktop.breadcrumbsHeight}px);
  display: flex;
  flex-direction: column;
`;
