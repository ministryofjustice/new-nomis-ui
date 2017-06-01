
import React from 'react';
import PropTypes from 'prop-types';
import { Select } from './select.theme';
import ToggleOption from '../ToggleOption';

function Toggle({ onToggle, values, value, messages }) {
  let content = (<option>--</option>);

  // If we have items, render them
  if (values) {
    content = values.map((val) => (
      <ToggleOption key={val} value={val} message={messages[val]} />
    ));
  }

  return (
    <Select value={value} onChange={onToggle}>
      {content}
    </Select>
  );
}

Toggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
};

export default Toggle;
