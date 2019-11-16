import React from 'react';
import { withFormik, Field } from 'formik';
import auth0 from 'auth0-js';
import * as Yup from 'yup';
import './SignUp.css';

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    password: Yup.string()
      .required('Password is required!'),
  }),
  mapPropsToValues: props => ({
    password: '',
  }),
  handleSubmit: (values, { setSubmitting }) => {
    const { email, password } = values;

    // Initialize client
    const webAuth = new auth0.WebAuth({
      domain: 'crowds-cure.auth0.com',
      clientID: 'z5cXMPTxeFOdB3i4xRA8JyhTonQmqMKM'
    });

    const options = { 
      realm: "Username-Password-Authentication",
      connection: 'Username-Password-Authentication',
      password,
      responseType: 'token id_token',
    };

    const isEmail = email.includes('@');
    if (isEmail) {
        options.email = email;
    } else {
        options.username = email;
    }

    
    webAuth.login(options, function (err) { 
      if (err) {
        alert(`Something went wrong: ${err.message}`);
        throw new Error(err.message); 
      }

      console.warn('Done! Redirect?');

      window.location = 'https://cancer.crowds-cure.org/'
    });
    setSubmitting(false);
  },
  displayName: 'SignUpForm',
});

const SignInForm = (props) => {
  const {
    handleSubmit,
    isSubmitting,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field name="email">
        {({ field, form, meta }) => (
          <div>
            <label htmlFor="email">Email</label>
            <input type="text"
              {...field}
              required
              placeholder="Email"
              autoComplete="email"/>
            {meta.touched &&
              meta.error && <div className="error">{meta.error}</div>}
          </div>
        )}
      </Field>
      <Field name="password">
        {({ field, form, meta }) => (
          <div>
            <label htmlFor="password">Password</label>
            <input type="password"
              {...field}
              required
              placeholder="Password"
              autoComplete="new-password"/>
            {meta.touched &&
              meta.error && <div className="error">{meta.error}</div>}
          </div>
        )}
      </Field>
      <button
        type="submit"
        className="btn"
        disabled={isSubmitting}>Submit</button>
    </form>
  );
};

const EnhancedSignInForm = formikEnhancer(SignInForm);


export default EnhancedSignInForm;