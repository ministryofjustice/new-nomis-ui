import React from 'react';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import { InputLabel, InputError } from 'components/FormComponents/Input/input.theme'; // , InputGroup, Base
import Select from 'containers/FormContainers/RFReactSelect';
import styled from 'styled-components';
import colours from 'theme/colours';

const TypeSubTypeHolder = styled.div`
  display: flex;
  flex-direction: ${({ isMobile }) => isMobile ? 'column' : 'row'};
`;

const AltGroup = styled.div`
  flex-grow: 1;
  position: relative;
  margin-bottom: 10px;
  ${
    ({ isMobile }) => isMobile ? `
      margin-top: 10px;
      width: 100%;
    ` : `
      &:not(:first-of-type){
        margin-left: 30px;
      }
      width: 50%;
    `
  }
  ${
    ({ error }) => error ? `
      box-sizing: border-box;
      border-left: ${colours.forms.errorColour} solid 5px;
      padding-left: 10px;
      margin-left: -15px;` : ''
  }
`;

class TypeSubTypeSelector extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      value: PropTypes.object.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.shape({
        type: PropTypes.string,
        subType: PropTypes.string,
      }),
    }).isRequired,
    options: PropTypes.object,
    isMobile: PropTypes.bool,
    multi: PropTypes.bool,
  }

  static defaultProps = {
    isMobile: false,
    options: {
      types: [{ value: 'a', label: 'a' }, { value: 'b', label: 'b' }, { value: 'c', label: 'c' }],
      subTypes: ['a', 'b', 'c'].reduce((acc, c) => acc.concat(new Array(5).fill(0).map((_, i) => ({ value: `${i}${c}`, label: `${c}${i}`, parent: c }))), []),
    },
    multi: false,
  }

  constructor(props) {
    super(props);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeSubType = this.handleChangeSubType.bind(this);
    this.filterSubTypeOptions = this.filterSubTypeOptions.bind(this);
    const { types, subTypes } = this.props.options;
    this.typesList = types;
    this.subTypesList = subTypes;
    this.typesObj = types.reduce((acc, x) => ({ ...acc, [x.value]: x }), {});
    this.subTypesObj = subTypes.reduce((acc, x) => ({ ...acc, [x.value]: x }), {});
  }

  filterSubTypeOptions() {
    const value = this.props.input.value;
    const selectedTypes = value.get('type');
    if (typeof selectedTypes === 'string' && selectedTypes && selectedTypes !== '') {
      return this.subTypesList.filter((sT) => selectedTypes === sT.parent);
    }

    if (selectedTypes && selectedTypes.length > 0) {
      return this.subTypesList.filter((sT) => selectedTypes.indexOf(sT.parent) !== -1);
    }
    return this.subTypesList;
  }

  filterSubTypeValues(type) {
    const subTypes = this.props.input.value.get('subType');
    const multi = this.props.multi;
    if (!subTypes) return subTypes;
    if (multi) {
      if (type && type.length > 0) {
        return subTypes.map((sT) => this.subTypesObj[sT]).filter((sT) => type.indexOf(sT.parent) !== -1).map((sT) => sT.value);
      }
      return subTypes;
    }

    return this.subTypesObj[subTypes].parent === type ? subTypes : '';
  }

  handleChangeType(type) {
    const currentVal = this.props.input.value;
    this.props.input.onChange(currentVal.set('type', type).set('subType', this.filterSubTypeValues(type)));
  }

  handleChangeSubType(subType) {
    const currentVal = this.props.input.value;
    this.props.input.onChange(currentVal.set('subType', subType));
  }

  render() {
    const {
      input,
      meta: { touched, error },
      options,
      isMobile,
      multi,
    } = this.props;
    const {
      onBlur: oB,
      value: val,
    } = input;
    const onBlur = () => oB(val);
    const typeInput = { ...input, value: val.get('type'), onChange: this.handleChangeType, onBlur };
    const subTypeInput = { ...input, value: val.get('subType'), onChange: this.handleChangeSubType, onBlur };
    return (
      <TypeSubTypeHolder isMobile={isMobile} >
        <AltGroup isMobile={isMobile} error={touched && error && error.type}>
          <InputLabel>Type</InputLabel>
          <InputError error={touched && error && error.type}>{error && error.type ? error.type : null}</InputError>
          <Select {...{ input: typeInput, options: options.types, multi }} />
        </AltGroup>
        <AltGroup isMobile={isMobile} error={touched && error && error.subType}>
          <InputLabel>Sub Type</InputLabel>
          <InputError error={touched && error && error.subType}>{error && error.subType ? error.subType : null}</InputError>
          <Select {...{ input: subTypeInput, options: this.filterSubTypeOptions(), multi }} />
        </AltGroup>
      </TypeSubTypeHolder>
    );
  }
}

export default TypeSubTypeSelector;
