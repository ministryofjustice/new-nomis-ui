import styled from 'styled-components';
import colours from 'theme/colours';
import { Link } from 'react-router';

export const BreadcrumbLink = styled(Link)`
  font-size: 15px;
  color: ${colours.baseFont};
`;

export const BreadcrumbLinkWrapper = styled.div`
  display: inline-block;
  
  span {
    width: 16px;
    display: inline-block;
    text-align: center;
  }
`;
