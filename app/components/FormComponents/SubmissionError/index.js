import React from 'react';
import PropTypes from 'prop-types';
//import { InputGroup, Input, InputLabel, InputError } from './input.theme';


export const InputError = () => <div></div>

const Input = React.createClass({
   render(){
     return (
       <div>
          <input className="form-control" {...this.props} />
       </div>
     )
   }
})

const FormGroup = React.createClass({
  render(){
    return <div className="form-group">
      {this.props.children}
    </div>
  }
})

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
