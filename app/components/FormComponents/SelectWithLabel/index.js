import React from 'react';

const renderField = ({ options,input, title, type, placeholder, meta: { touched, error } }) => (
  <div className={ !(touched && error) ? 'form-group' : 'form-group form-group-error'}>

    <label className="form-label">{title}</label>

    <div className="error-message">
      {touched && ((error && <span>{error}</span>))}
    </div>

    <select className={ ! (touched && error) ? 'form-control' : 'form-control form-control-error'} {...input}>

      <option value="" selected disabled hidden>Select</option>

      {options.map(option =>
        <option key={option.value} value={option.value}>
        {option.label}
       </option>
      )}
    </select>

  </div>
)

export default renderField;