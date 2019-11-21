import React from 'react';
import { withFormik, Field } from 'formik';
import * as Yup from 'yup';
import './SignIn.css';
import { Auth } from 'aws-amplify';

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

    const options = { 
      password,
    };

    const isEmail = email.includes('@');
    if (isEmail) {
        options.email = email;
    } else {
        options.username = email;
    }
    
    // For advanced usage
    // You can pass an object which has the username, password and validationData which is sent to a PreAuthentication Lambda trigger
    Auth.signIn(options).then(user => {
      console.log(user)

      console.warn('Done! Redirect?');

      window.location = 'https://cancer.crowds-cure.org/'
    })
    .catch(err => {
      if (err) {
        alert(`Something went wrong: ${err.message}`);
        throw new Error(err.message); 
      }
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