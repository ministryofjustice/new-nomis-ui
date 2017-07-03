import styled from 'styled-components';
import colours from 'theme/colours';

export const FooterContainer = styled.div`
  width: 100%;
  height: 140px;
  background: ${colours.footer.bg};
`;

export const FooterLinksContainer = styled.div`
  max-width: 1170px;
  padding-top: 10px;
`;

export const FooterLink = styled.div`
  float: left;
  padding: 0px 19px;
  border-right: 1px solid black;
  height: 19px;
  cursor: pointer;

  &:last-child {
    border-right: 0px;
  }
  &:first-child {
    padding-left: 14px;
  }
`;

export const FooterSignature = styled.div`
  max-width: 1170px;
  clear: left;
  margin-top: 37px;
  padding-left: 14px;
`;
