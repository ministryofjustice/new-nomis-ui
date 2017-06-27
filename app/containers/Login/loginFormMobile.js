import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import { Map } from 'immutable';
import { Input, SubmissionError } from 'components/FormComponents';
import Button from 'components/Button';
import {
  Form,
} from './mobile.theme';

const LoginFormMobile = (props) => {
  const { handleSubmit, submitting, error } = props;
  return (
    <Form onSubmit={handleSubmit} data-name={'Form'}>
      <SubmissionError error={error}>{error}</SubmissionError>
      <Field name="username" component={Input} type="text" title="Username" />
      <Field name="password" component={Input} type="password" title="Password" autocomplete="off" />
      <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="submit" >Sign In</Button>
    </Form>
  );
};

LoginFormMobile.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
};
LoginFormMobile.defaultProps = {
  error: '',
};
export default reduxForm({
  form: 'login', // a unique identifier for this form
  initialValues: Map({
    redirect: '/',
  }),
  validate: (stuff) => {
    const { username, password } = stuff.toJS();
    const errors = {};
    if (!username) {
      errors.username = 'Required';
    }
    if (!password) {
      errors.password = 'Required';
    }
    return errors;
  },
})(LoginFormMobile);
