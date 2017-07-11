import styled from 'styled-components';
import { Link } from 'react-router';
import { media } from '../../utils/style-utils';

export const NavLinkLink = styled(Link)`
  font-size: 15px;
  color: black;
`;

export const NavLinkWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  ${media.mobile`margin-top: 30px;`}
  margin-bottom: 30px;
  ${media.mobile`margin-bottom: 0;`}
  width: 100%;
  max-width: 1170px;
`;
