import React from 'react';

const renderField = ({ resetValue, options, input, title, meta: { touched, error } }) => {
  if (resetValue === true) { setTimeout(() => input.onChange(null),100); }

  return (
    <div className={!(touched && error) ? 'form-group' : 'form-group form-group-error'}>

      <label className="form-label">{title}</label>

      <div className="error-message">
        {touched && ((error && <span>{error}</span>))}
      </div>

      <select className={!(touched && error) ? 'form-control' : 'form-control form-control-error'} {...input}>

        <option value="" disabled hidden>Select</option>

        {options.map((option) =>
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )}
      </select>

    </div>
  );
};


export default renderField;
