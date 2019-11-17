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
  handleSubmit: (values, { props, setSubmitting }) => {
    const { email, password } = values;

    const { config } = props;

    const params = Object.assign({
        /* additional configuration needed for use of custom domains */
        overrides: {
          __tenant: config.auth0Tenant,
          __token_issuer: config.authorizationServer.issuer,
          __jwks_uri: `${config.authorizationServer.issuer}.well-known/jwks.json`
        },
        //
        domain: config.auth0Domain,
        clientID: config.clientID,
        redirectUri: config.callbackURL,
        responseType: 'code'
      }, config.internalOptions);

        // Initialize client
    const webAuth = new auth0.WebAuth(params);

    window.webAuth = webAuth;

    const options = { 
      realm: "Username-Password-Authentication",
      password,
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
      <h2>Sign In</h2>
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