import styled from 'styled-components';
import colours from 'theme/colours';
import fonts from 'theme/fonts';
import { Link } from 'react-router';
import { media } from 'utils/style-utils';
import desktop from 'theme/desktop';

export const PageHeader = styled.header`
  ${fonts.misc}
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  color: ${colours.headerTextColour};
  background-color: ${colours.headerColour};
  z-index: 999;
  height: ${desktop.headerHeight}px;
  width: 100%;
  
  ${media.desktop`
    justify-content: center;
  `}
`;

export const LeftContent = styled.div`
  float: left;
`;

export const RightContent = styled.div`
  float: right;
  height: 100%;
`;

export const Logo = styled.div`
  margin-left: 10px;
  margin-right: 5px;
  float: left;
`;

export const LogoText = styled(Link)`
  display: none;
  
  color: white;
  font-size: 26px;
  padding: 3px 15px 0 10px;
  font-weight: bold;
  border-right: solid white 1px;
  margin-right: 15px;
  text-decoration: none;
      
  ${media.desktop`
    display: inline-block;
  `}
`;

export const Title = styled(Link)`
  text-align: left;
  padding-left: 10px;
  font-size: 26px;
  flex-grow: 1;
  text-decoration: none;
      
  ${media.desktop`
     padding-left: 0px;
  `}
`;

export const ToggleWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: block;
`;
