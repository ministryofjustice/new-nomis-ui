import styled from 'styled-components';
import colours from 'theme/colours';
import fonts from 'theme/fonts';
import InlineSVG from 'react-svg-inline';
import { Link } from 'react-router';
import { media } from 'utils/style-utils';
import desktop from 'theme/desktop';

export const Base = styled.div`
  ${fonts.misc}
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: ${colours.headerTextColour};
  
  background-color: ${colours.headerColour};
  z-index: 999;
  height: ${desktop.headerHeight}px;
  width: 100%;
    
  ${media.desktop`
    position: relative;
  `}
`;

export const Logo = styled.div`
  margin-top: 5px;
  margin-left: 10px;
  margin-right: 5px;
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
    display: block;
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

export const Hamburger = styled(InlineSVG)`
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  padding: 9px 46px;
  width: 40px;
  height: 30px;
  
  svg {
    display: block;

    width: 30px;
    height: 42px;
    fill: inherit;
  }
`;

export const ArrowBack = styled(InlineSVG)`
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  padding-top: 18px;
  padding-left: 5px;
  width: 40px;
  height: 43px;
  
  svg {
    display: block;

    width: 30px;
    height: 24px;
    fill: inherit;
  }
`;
