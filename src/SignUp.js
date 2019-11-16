import React from 'react';
import { withFormik, Field } from 'formik';
import auth0 from 'auth0-js';
import * as Yup from 'yup';
import './SignUp.css';
import ConsentFactSheet from './ConsentFactSheet.js';
import CustomSelect from './CustomSelect.js';
import residencyProgram from './residencyProgram.js';
import occupation from './profession.js';
import { RadioButton, RadioButtonGroup } from './Radio.js';
import getUsername from './getUsername.js';

const randomNames = [
  getUsername(),
  getUsername(),
  getUsername(),
  getUsername(),
  getUsername(),
];

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
    occupation: Yup.string()
      .required('Occupation is required!'),
  }),
  mapPropsToValues: props => ({
    email: '',
    occupation: '',
    residencyProgram: '',
    firstName: '',
    lastName: '',
  }),
  handleSubmit: (values, { setSubmitting }) => {
    /*const payload = {
      ...values,
      topics: values.topics.map(t => t.value),
    };*/
    setTimeout(() => {
      console.log(JSON.stringify(values, null, 2));
      const { email, password, firstName, lastName } = values;
      const username = email.replace('@', '_');

      // Initialize client
      const webAuth = new auth0.WebAuth({
        domain: 'crowds-cure.auth0.com',
        clientID: 'z5cXMPTxeFOdB3i4xRA8JyhTonQmqMKM'
      });
      
      webAuth.signup({ 
        connection: 'Username-Password-Authentication',
        email, 
        password,
        username,
        given_name: firstName,
        family_name: lastName,
        name: `${firstName} ${lastName}`,
        nickname: username,
        user_metadata: {
          "occupation": "Information Technology/Systems Support",
          "experience": "fiveToTen",
          "team": "notApplicable",
          "notificationOfDataRelease": "true"
        }
      }, function (err) { 
        if (err) return alert('Something went wrong: ' + err.message); 
          return alert('success signup without login!') 
      });
      setSubmitting(false);
    }, 1000);
  },
  displayName: 'SignUpForm',
});

const SignUpForm = (props) => {
  const {
    values,
    touched,
    dirty,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.firstName}
      />
      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.lastName}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autocomplete="new-password"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.password}
      />
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        autocomplete="email"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
      />
      <CustomSelect
        value={values.occupation}
        fieldName={'occupation'}
        label={'Occupation'}
        options={occupation}
        onChange={setFieldValue}
        onBlur={setFieldTouched}
        error={errors.occupation}
        touched={touched.occupation}
      />
      <CustomSelect
        value={values.residencyProgram}
        fieldName={'residencyProgram'}
        label={'Hospital or Country'}
        options={residencyProgram}
        onChange={setFieldValue}
        onBlur={setFieldTouched}
        error={errors.residencyProgram}
        touched={touched.residencyProgram}
      />

      <label>Username</label>
      <RadioButtonGroup
        id="username"
        label="Select a Username"
        value={values.username}
        error={errors.username}
        touched={touched.username}
      >
        {randomNames.map(name => (
          <Field
            key={name}
            id={name}
            component={RadioButton}
            name="username"
            label={name}
          />  
        ))}
      </RadioButtonGroup>

      <ConsentFactSheet/>
      <label htmlFor="consent">I have read and agree to the consent fact sheet.</label>
      <input
        id="consent"
        name="consent"
        type="checkbox"
        required
        onChange={handleChange}
        onBlur={handleBlur}
        defaultChecked={values.consent}
        value={values.consent}
      />
      <button
        type="button"
        className="btn"
        onClick={handleReset}
        disabled={!dirty || isSubmitting}
      >
        Reset
      </button>
      <button
        type="submit"
        className="btn"
        disabled={isSubmitting}>Submit</button>
    </form>
  );
};

const EnhancedSignUpForm = formikEnhancer(SignUpForm);


export default EnhancedSignUpForm;