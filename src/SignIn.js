import React from 'react';
import { withFormik, Field } from 'formik';
import auth0 from 'auth0-js';
import * as Yup from 'yup';
import './SignIn.css';

const ERROR_MESSAGES = {
  request_error: "Something went wrong: try again later or contact the administrator",
  generic: "Something went wrong: try again later or contact the administrator"
};

const getErrorMessage = (err = {}) => {
  const { code = "", description } = err;
  const messageFromApp = err ? ERROR_MESSAGES[code] : ERROR_MESSAGES.generic;
  
  let messageToUse = description;
  try {
    JSON.parse(description)

  } catch(e) {
    messageToUse = messageFromApp
  }
  return messageToUse || ERROR_MESSAGES.generic;
}

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .required('Username or Email is required'),
    password: Yup.string()
      .required('Password is required'),
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
        alert(`Something went wrong: ${getErrorMessage(err)}`);
        throw new Error(err.message); 
      }

      console.warn('Done! Redirect?');

      window.location = 'https://cancer.crowds-cure.org/'
    });
    setSubmitting(false);
  },
  displayName: 'SignInForm',
  validateOnMount: true,
});

class SignInForm extends React.Component {
  constructor() {
    super();

    this.redirectToSignUp = this.redirectToSignUp.bind(this);
  }

  renderEmailField() {
    return (
      <Field name="email">
        {({ field, form, meta }) => (
            <input type="text"
              {...field}
              required
              placeholder="Username or Email"
              autoComplete="email"
            />
        )}
      </Field>
    );
  }

  renderPasswordField() {
    return (
      <Field name="password">
        {({ field, form, meta }) => (
          <input type="password"
            {...field}
            required
            placeholder="Password"
            autoComplete="new-password"
          />
        )}
      </Field>
    );
  }

  renderErrorMessages() {
    const { errors } = this.props;
    const errorMessages = [];

    Object.keys(errors).forEach(key => {
      const meta = this.props.getFieldMeta(key);
      if (meta && meta.touched) {
        errorMessages.push(meta.error);
      }
    });

    if (errorMessages.length) {
      return <div className="error">{errorMessages.join('; ')}</div>;
    }
  }

  getLoginButtonDisabledClass() {
    const { isSubmitting, errors } = this.props;
    const hasErrors = Object.keys(errors).length > 0;
    return isSubmitting || hasErrors ? 'disabled' : '' ;
  }

  redirectToSignUp() {
    this.props.togglePage('signup');
  }

  render() {
    const { handleSubmit, isSubmitting } = this.props;

    return (
      <form className="SignIn" onSubmit={handleSubmit}>
        <h2>Log in</h2>
        {this.renderEmailField()}
        {this.renderPasswordField()}
        {this.renderErrorMessages()}
        <button className="forgotPassword link">Forgot your password?</button>
        <div className="actions">
          <button
            className="linkSignup link"
            onClick={this.redirectToSignUp}
          >Create account</button>
          <button
            type="submit"
            className={`btnLogin btn ${this.getLoginButtonDisabledClass()}`}
            disabled={isSubmitting}
          >Log in</button>
        </div>
      </form>
    );
  }
}

const EnhancedSignInForm = formikEnhancer(SignInForm);


export default EnhancedSignInForm;