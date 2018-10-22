import styled from 'styled-components'
import colours from 'theme/colours'
// import desktop from 'theme/desktop';

const { desktopTabNav } = colours.bookings.details

export const TabWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  ${'' /* justify-content: space-between; */} height: 55px;
  border-bottom: solid ${desktopTabNav.underline} 2px;
  > div {
    height: 100%;
  }
`

export const TabMenuItem = styled.div`
  color: ${desktopTabNav.textColour};
  padding: 0 40px;
  text-align: center;
  font-size: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;

  @media (max-width: 1200px) {
    font-size: 19px;
  }

  cursor: ${({ active }) => (active ? 'normal' : 'pointer')};

  &:not(:first-child) {
    margin-left: 15px;
  }
  &:not(:last-child) {
    margin-right: 15px;
  }

  &:after {
    content: '';
    width: 100%;
    height: ${({ active }) => (active ? '6px' : '0px')};
    background: ${desktopTabNav.activeUnderline};
    ${'' /*  */} position: absolute;
    bottom: 0px;
    left: 0px;
    transition: height 0.25s;
  }

  &:hover:after {
    height: ${({ active }) => (active ? '9px' : '6px')};
  }
`
