import React from "react";
import PropTypes from "prop-types";

export const InputError = () => <div />;

const Input = props => {
      <div>
    <input className="form-control" {...props} />
  </div>;
};

const FormGroup = ({ children }) => {
  <div className="form-group">{children}</div>;
};

const renderInput = ({ input, title, type, meta: { touched, error } }) => (
  <FormGroup error={touched && error}>
    <label>{title}</label>
    <InputError error={touched && error}>{error}</InputError>
    <Input {...input} type={type} />
  </FormGroup>
);

renderInput.propTypes = {
  input: PropTypes.object.isRequired,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  // error: PropTypes.string.isRequired,
};

renderInput.defaultProps = {
  title: '',
};

export default renderInput;
