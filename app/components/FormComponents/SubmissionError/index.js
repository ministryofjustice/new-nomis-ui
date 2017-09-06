import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const InputError = () => <div></div>;

class Input extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <input className="form-control" {...this.props} />
      </div>
    );
  }
}

class FormGroup extends Component {  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (<div className="form-group">
      {this.props.children}
    </div>);
  }
}

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
