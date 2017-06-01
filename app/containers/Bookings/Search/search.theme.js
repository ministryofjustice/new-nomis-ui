import styled from 'styled-components';
import colours from 'theme/colours';

import RFReactSelect from './RFReactSelect';

export const Heading = styled.div`
  color: black;
  text-align: center;
`;

export const Form = styled.form`
  width: 570px;
  margin: auto;
  position: relative;
`;

export const FormHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

export const FormTitle = styled.div`
  font-size: 26px;
  flex-grow: 1;
`;

export const FormResetLink = styled.a`
  font-size: 19px;
  color: ${colours.linkColour};
  text-decoration: underline;
  cursor: pointer;
`;

export const Label = styled.label`
  width:100%;
  margin:0;
  padding:0;
`;

// Retheming the crazy dropdown...
export const StyledSelect = styled(RFReactSelect)`
  &.is-focused {
    /*outline: 3px solid ${colours.forms.textInput.focusBorder};
    outline-offset: 0;*/

    &:not(.is-open)>.Select-control {
      outline: 3px solid ${colours.forms.textInput.focusBorder};
      outline-offset: 0;
      border-color: black;
    }
  }
  .Select-control {
    border: solid black 3px;
    border-radius: 0px;
    height: 50px;

    .Select-multi-value-wrapper {
      display: flex;
      align-items: center;
      height: 44px; /* Hack to make it center without changing... */

      .Select-value {
        margin: 0 5px;
      }

      .Select-placeholder {
        position: absolute;
        display: block;
        font-size: 0.9em;
        line-height: 1;
        top: 17px;
      }
    }
  }

  &.is-focused>.Select-control {
    border-color: black;
  }
  .Select-menu-outer {
    border: solid black 3px;
    border-top-width: 1px;
    max-height: 202px;
  }


`;
