import styled from 'styled-components';
import colours from 'theme/colours';

import RFReactSelect from './RFReactSelect';

export const Heading = styled.div`
  color: #0b0c0c;
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
      border-color: #0b0c0c;
    }
  }

  &.Select--single>.Select-control .Select-multi-value-wrapper .Select-value {
    background : none;
  }

  .Select-control {
    border: solid #0b0c0c 3px;
    border-radius: 0px;
    /*height: 50px;*/
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
      flex-wrap: wrap;
      align-items: center;
      /* height: 44px;  Hack to make it center without changing... */

      .Select-value {
        margin: 5px 5px;
        background: ${colours.forms.dropdown.background};
        border: 0px;
        border-radius: 0px;
        color: #0b0c0c;
        display: flex;
      }

      .Select-placeholder {
        /*position: absolute;*/
        display: block;
        font-size: 0.9em;
        line-height: 46px;
        /*top: 17px;*/
      }

      .Select-value-label{
        padding: 5px 8px;
        order: 1;
      }
      .Select-input {
        height: auto;
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
    border-color: #0b0c0c;
  }
  .Select-menu-outer {
    border: solid #0b0c0c 3px;
    border-top-width: 1px;
    max-height: 202px;
  }


`;
