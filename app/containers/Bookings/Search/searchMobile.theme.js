import styled from 'styled-components';
import colours from 'theme/colours';

import RFReactSelect from './RFReactSelect';

export const Heading = styled.div`
  color: ${colours.baseFont};
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
  font-size: 24px;
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
    /*outline: 2px solid ${colours.forms.textInput.focusBorder};
    outline-offset: 0;*/

    &:not(.is-open)>.Select-control {
      outline: 2px solid ${colours.forms.textInput.focusBorder};
      outline-offset: 0;
      border-color: ${colours.baseFont};
    }
  }
  .Select-control {
    border: solid ${colours.baseFont} 2px;
    border-radius: 0px;
    font-size: 19px;

    /* .VirtualizedSelectFocusedOption {
      background-color: ${colours.forms.dropdown.background};
    } */

    .Select-arrow-zone {
      /* position: absolute;
      top: 4px;
      right: 1px; */
      background-image: url('/img/dropdown-chevron.png');
      background-position: center;
      padding: 20px;
    }

    .Select-arrow {
      display: none;
    }

    .Select-multi-value-wrapper {
      display: flex;
      align-items: center;
      /* height: 44px;  Hack to make it center without changing... */

      .Select-value {
        margin: 5px 5px;
        background: ${colours.forms.dropdown.background};
        border: 0px;
        border-radius: 0px;
        color: ${colours.baseFont};
        display: flex;
      }

      .Select-placeholder {
        position: absolute;
        display: block;
        font-size: 0.9em;
        line-height: 1;
        top: 17px;
      }

      .Select-value-label{
        padding: 5px 8px;
        order: 1;
      }

      .Select-value-icon{
        border: 0px;
        background-image: url('/img/x.png');
        width: 37px;
        height: 34px;
        background-repeat: no-repeat;
        background-position: center;
        font-size: 0px;
        color: transparent;
        order: 2;
      }
    }
  }

  &.is-focused>.Select-control {
    border-color: ${colours.baseFont};
  }
  .Select-menu-outer {
    border: solid ${colours.baseFont} 2px;
    border-top-width: 1px;
    max-height: 202px;
  }


`;

export const FormWrapper = styled.form`
  padding: 20px 20px;

  select {
    font-size: 16px;
    width: 100%;
    height: 100px;
  }

  textarea {
    font-size: 16px;
  }

  label {
    font-size: 16x;
    margin-top: 35px;
  }

  button {
    position: fixed;
    bottom: 0px;
    left: 0px;
    margin:auto;
    width: 100%;
    font-size: 16px;
    height:50px;
  }

  input {
    font-size: 16px;
    margin-bottom: 5px;
  }

  .Select {
    font-size: 16px;
    margin-bottom: 5px;
  }
  .Select-control {
    font-size: 16px;
    margin-bottom: 5px;
  }
  .Select-menu-outer {
    div {

    }
  }

  span {
    margin-bottom: 25px;
  }
`;

export const FieldWrapper = styled.div`
  padding: 0px 20px;
`;

