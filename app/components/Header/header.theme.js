/* eslint-disable import/no-unresolved */
import styled from 'styled-components'
import colours from 'theme/colours'
import fonts from 'theme/fonts'
import { media } from 'utils/style-utils'
import desktop from 'theme/desktop'
import { Link } from 'react-router-dom'

export const PageHeader = styled.header`
  ${fonts.misc} display: flex;
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
  `};

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 14px;
  font-size: 0.875rem;
  line-height: 1.14286;
  border-bottom: 10px solid #fff;
  color: #fff;
  background: #0b0c0c;

  position: relative;
  margin-bottom: -10px;
  padding-top: 10px;
  border-bottom: 5px solid #000;
`

export const LeftContent = styled.div`
  float: left;
`

export const RightContent = styled.div`
  float: right;
  height: 100%;
`

export const Logo = styled.span`
  margin-right: 5px;
`

export const CrestImg = styled.img`
  position: relative;
  top: -4px;
  width: 36px;
  height: 32px;
  border: 0;
  vertical-align: middle;
`

export const LogoText = styled.span`
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
  `};
`

export const Title = styled.span`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 18px;
  font-size: 1.125rem;
  line-height: 1.11111;
  display: inline-table;
  padding-right: 10px;
`

export const ToggleWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: block;
`

export const UnstyledLink = styled(Link)`
  text-decoration: none;
  color: white;
`
