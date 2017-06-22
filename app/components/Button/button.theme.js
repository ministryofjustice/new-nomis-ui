import styled, { keyframes } from 'styled-components';
import fonts from 'theme/fonts';
import colours from 'theme/colours';
import { Link } from 'react-router';
import { omit } from 'lodash';
import React from 'react';

const linearShift = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 50px 0px;
  }
`;

const submitAfterOverlay = `&:disabled:after {
  content: "";
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background-image: linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.5) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.5) 75%,
    transparent 75%,
    transparent
  );

  z-index: 1;
  background-size: 50px 50px;
  background-repeat: repeat;
  animation: ${linearShift} 2s linear infinite;
  overflow: hidden;
}
`;

export const Button = styled.button`
  /* Adapt the colors based on primary prop */
  ${fonts.misc}
  font-size: 24px;
  ${''/* width: 175px; */}
  padding: 16px 40px 10px;
  background: ${(props) => colours.buttons[props.buttonstyle].background};
  border-bottom: 3px solid ${(props) => colours.buttons[props.buttonstyle].borderBottom};
  color: ${(props) => colours.buttons[props.buttonstyle].text};
  position: relative;
  margin-bottom: 15px;

  &:hover {
    background: ${(props) => colours.buttons[props.buttonstyle].hover.background};
    color: ${(props) => colours.buttons[props.buttonstyle].hover.text};
  }

  ${''/* ${({ buttonstyle }) => buttonstyle === 'submit' ? submitAfterOverlay : ''} */}

  ${submitAfterOverlay}

  &:disabled {
    background: ${(props) => colours.buttons[props.buttonstyle].hover.background}
    cursor: not-allowed;
  }
`;

// https://github.com/styled-components/styled-components/issues/184
export const StyledLink = styled((props) => <Link {...omit(props, ['buttonstyle'])} />)`
  text-decoration: none;
  text-align: center;
  /* Adapt the colors based on primary prop */
  ${fonts.misc}
  font-size: 24px;
  ${''/* width: 175px; */}
  padding: 16px 40px 10px;
  background: ${(props) => colours.buttons[props.buttonstyle].background};
  border-bottom: 3px solid ${(props) => colours.buttons[props.buttonstyle].borderBottom};
  color: ${(props) => colours.buttons[props.buttonstyle].text};
  position: relative;
  margin-bottom: 15px;

  &:hover {
    background: ${(props) => colours.buttons[props.buttonstyle].hover.background};
    color: ${(props) => colours.buttons[props.buttonstyle].hover.text};
  }

  ${({ buttonstyle }) => buttonstyle === 'submit' ? submitAfterOverlay : ''}

  &:disabled {
    background: ${(props) => colours.buttons[props.buttonstyle].hover.background}
    cursor: not-allowed;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;

  button, a {
    flex-grow: 1;
    &:not(:first-child) {
      margin-left: 15px;
    }
    &:not(:last-child) {
      margin-right: 15px;
      margin-bottom: 15px;
    }
  }
`;
