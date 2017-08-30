import React from 'react';
import PropTypes from 'prop-types';


const renderTextArea = ({ input, title, type, meta: { touched, error }, placeholder }) => (
  <div className={ !(touched && error) ? 'form-group' : 'form-group form-group-error'}>
  <label className="form-label">{title}</label>
  { (error && touched) ? <div className="error-message" error={touched && error}>{error}</div> : null}
  <textarea className={ ! (touched && error) ? 'form-control' : 'form-control form-control-error'} {...input} error={touched && error} type={type} autoComplete="off" placeholder={placeholder} cols='30' rows='10' />
</div>);

renderTextArea.propTypes = {
  input: PropTypes.object.isRequired,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
};

renderTextArea.defaultProps = {
  title: '',
  placeholder: '',
};

export default renderTextArea;
