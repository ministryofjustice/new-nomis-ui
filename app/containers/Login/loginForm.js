import React from 'react';
import PropTypes from 'prop-types';

import { reduxForm, Field } from 'redux-form/immutable';
import { Map } from 'immutable';

import InputWithLabel from 'components/FormComponents/InputWithLabel'

import { injectIntl, intlShape } from 'react-intl';


const LoginForm = ({ handleSubmit, submitting, intl, error}) => (

    <form onSubmit={handleSubmit}>

      <div className="col-lg-7 col-md-7">
          {
            error &&
            <div className="error-summary">
              <span>{error.defaultMessage}</span>
            </div>
          }

        <Field name="username" component={InputWithLabel} type="text" title="Username"/>
        <Field name="password" component={InputWithLabel} type="password" title="Password" autocomplete="off"/>

        <input
          className="button col-xs-12 col-sm-12 col-md-12 col-lg-3"
          type="submit"
          disabled={submitting}
          value="Sign In"
        />

      </div>

    </form>
);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  //error: PropTypes.string,
  intl: intlShape.isRequired,
};

LoginForm.defaultProps = {
  error: ''
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
