import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { reduxForm } from 'redux-form/immutable';

import { Input, SubmissionError } from 'components/FormComponents';
import Button from 'components/Button';
import {
  Form,
} from './login.theme';

const LoginForm = (props) => {
  const { handleSubmit, submitting, error } = props;
  return (
    <Form onSubmit={handleSubmit}>
      <SubmissionError error={error}>{error}</SubmissionError>
      <Field name="username" component={Input} type="text" title="E-mail" />
      <Field name="password" component={Input} type="password" title="Password" />
      <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="submit">Sign In</Button>
    </Form>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
};
LoginForm.defaultProps = {
  error: '',
};
export default reduxForm({
  form: 'login', // a unique identifier for this form
  initialValues: {
    redirect: '/',
  },
  validate: ({ username, password }) => {
    const errors = {};
    if (!username) {
      errors.username = 'Required';
    }
    if (!password) {
      errors.password = 'Required';
    }
    return errors;
  },
})(LoginForm);
