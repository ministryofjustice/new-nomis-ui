import React from 'react';
import PropTypes from 'prop-types';

import { reduxForm, Field } from 'redux-form/immutable';
import { Map } from 'immutable';

import InputWithLabel from 'components/FormComponents/InputWithLabel';

import { injectIntl } from 'react-intl';


const LoginForm = ({ handleSubmit, submitting, error }) => (
  <form onSubmit={handleSubmit}>
    <div className="col-md-8">

      {error &&
      <div className="row">
        <div className="error-summary col-sm-6">
          {error.defaultMessage}
        </div>
      </div>
      }

      <div className="row">
        <Field name="username" component={InputWithLabel} type="text" title="Username" />
        <Field name="password" component={InputWithLabel} type="password" title="Password" autocomplete="off" />
        <input className="button alert col-sm-2" type="submit" disabled={submitting} value="Sign In" />
      </div>

      <div className="row">
            &nbsp;
      </div>
    </div>

  </form>
);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

LoginForm.defaultProps = {
  error: '',
};

export default injectIntl(reduxForm({
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
})(LoginForm));
