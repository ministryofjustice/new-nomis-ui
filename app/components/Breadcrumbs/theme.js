import styled from 'styled-components';
import { Link } from 'react-router';

export const BreadcrumbLink = styled(Link)`
  font-size: 15px;
  color: black;
`;

export const BreadcrumbWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 1170px;
`;

export const BreadcrumbLinkWrapper = styled.div`
  display: inline-block;
  span {
    width: 16px;
    display: inline-block;
    text-align: center;
  }
`;
