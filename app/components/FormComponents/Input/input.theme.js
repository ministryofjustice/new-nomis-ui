import styled from 'styled-components';
import fonts from 'theme/fonts';
import colours from 'theme/colours';

export const Base = (props) => `
  box-sizing: border-box;
  font-family: "nta", Arial, sans-serif;
  font-weight: 400;
  text-transform: none;
  height: 50px;
  width: 100%;
  background: ${colours.forms.textInput.background};
  padding: 0 5px;
  border: 2px solid ${props.error ? colours.forms.errorColour : colours.forms.textInput.border};
  &:focus {
    outline: 2px solid ${colours.forms.textInput.focusBorder};
    outline-offset: 0;
  }
  ${fonts.misc}
`;

export const InputGroup = styled.div`
  position: relative;

  ${
    ({ error }) => error ? `
      box-sizing: border-box;
      border-left: ${colours.forms.errorColour} solid 5px;
      padding-left: 10px;
      margin-left: -15px;` : ''
  }


  &:not(:first-of-type) {
    margin-top: 20px;
  }

  &:not(:last-of-type) {
    margin-bottom: 20px;
  }

  &:last-of-type {
    margin-bottom: 37px;
  }
`;

export const InputError = styled.div`
  height: ${({ error }) => error ? '22px' : 0}
  ${fonts.misc}
  color: ${colours.forms.errorColour};
  transition: height 0.5s;
`;

export const InputLabel = styled.label`
  font-size: 19px;
  line-height: 1.31579;
  font-weight: 400;
  display: block;
  ${fonts.misc}
  margin-bottom: 5px;
`;


export const Input = styled.input`
  ${Base}
`;

export const TextArea = styled.textarea`
  ${Base}
  height: 220px;
  padding: 5px;
`;
