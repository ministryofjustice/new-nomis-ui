import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SelectStyle } from './select.theme';


export default class Select extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };

  constructor() {
    super();

    // Bindings
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    return this.props.onChange(this.props.id, e.target.value);
  }

  render() {
    const { options, selected } = this.props;
    return (

      <SelectStyle value={selected} onChange={this.handleChange}>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label || opt.value}</option>
        ))}

      </SelectStyle>
    );
  }
}
