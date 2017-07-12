import styled from 'styled-components';
import colours from 'theme/colours';
import Select from 'react-select';

// import { RFReactSelect } from './RFReactSelect.theme';

export const StyledSelect = styled(Select)`
  &.is-focused {
    /*outline: 2px solid ${colours.forms.textInput.focusBorder};
    outline-offset: 0;*/

    &:not(.is-open)>.Select-control {
      outline: 2px solid ${colours.forms.textInput.focusBorder};
      outline-offset: 0;
      border-color: ${colours.baseFont};
    }
  }

  &.Select--single>.Select-control .Select-multi-value-wrapper .Select-value {
    background : none;
  }

  .Select-control {
    border: solid ${colours.baseFont} 2px;
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
        color: ${colours.baseFont};
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
    border-color: ${colours.baseFont};
  }
  .Select-menu-outer {
    border: solid ${colours.baseFont} 2px;
    border-top-width: 1px;
    max-height: 202px;
  }


`;
