import React from 'react';
import { withFormik, Field } from 'formik';
import auth0 from 'auth0-js';
import * as Yup from 'yup';
import './SignUp.css';
import ConsentFactSheet from './ConsentFactSheet.js';
import CustomSelect from './CustomSelect.js';
import residencyProgram from './residencyProgram.js';
import profession from './profession.js';
import { RadioButton, RadioButtonGroup } from './Radio.js';
import getUsername from './getUsername.js';

const randomNames = [
  getUsername(),
  getUsername(),
  getUsername(),
  getUsername(),
  getUsername(),
];

const yearsOfExperienceOptions = [
  { value: "lessThan5", label: "<5" },
  { value: "fiveToTen", label: "5-10" },
  { value: "moreThan10", label: ">10" },
]

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
    profession: Yup.string()
      .required('Profession is required!'),
    residencyProgram: Yup.string()
      .required('Hospital or Country is required!'),
    firstName: Yup.string()
      .required('First name is required!'),
    lastName: Yup.string()
      .required('Last name is required!'),
    password: Yup.string()
      .required('Password is required!'),
    experience: Yup.string()
      .required('Years of experience is required!'),
    username: Yup.string()
      .required('Username is required!'),
  }),
  mapPropsToValues: props => ({
    email: '',
    profession: '',
    residencyProgram: '',
    firstName: '',
    lastName: '',
    password: '',
    experience: '',
    notificationOfDataRelease: false,
    consent: false,
    username: randomNames[0] 
  }),
  handleSubmit: (values, { setSubmitting }) => {
    console.log(JSON.stringify(values, null, 2));
    const { email,
      password,
      firstName,
      lastName,
      residencyProgram,
      profession,
      experience,
      notificationOfDataRelease,
      username,
      consent } = values;

    // Initialize client
    const webAuth = new auth0.WebAuth({
      domain: 'crowds-cure.auth0.com',
      clientID: 'z5cXMPTxeFOdB3i4xRA8JyhTonQmqMKM'
    });
    
    webAuth.signupAndAuthorize({ 
      connection: 'Username-Password-Authentication',
      email, 
      password,
      username,
      responseType: 'token id_token',
      given_name: firstName,
      family_name: lastName,
      name: `${firstName} ${lastName}`,
      nickname: username,
      user_metadata: {
        occupation: profession.value,
        experience,
        team: residencyProgram.value,
        // Note: for some reason, Auth0 wants these as Strings
        notificationOfDataRelease: notificationOfDataRelease.toString(),
        consent: consent.toString()
      }
    }, function (err) { 
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

const SignUpForm = (props) => {
  const {
    values,
    touched,
    dirty,
    errors,
    handleSubmit,
    handleReset,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field name="firstName">
        {({ field, form, meta }) => (
          <div>
            <label htmlFor="firstName">First Name</label>
            <input type="text"
              {...field}
              required
              placeholder="First Name"
              autoComplete="given-name"/>
            {meta.touched &&
              meta.error && <div className="error">{meta.error}</div>}
          </div>
        )}
      </Field>
      <Field name="lastName">
        {({ field, form, meta }) => (
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input type="text"
              {...field}
              required
              placeholder="Last Name"
              autoComplete="family-name"/>
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
      <Field name="email">
        {({ field, form, meta }) => (
          <div>
            <label htmlFor="email">Email</label>
            <input type="email"
              {...field}
              required
              placeholder="Email"
              autoComplete="email"/>
            {meta.touched &&
              meta.error && <div className="error">{meta.error}</div>}
          </div>
        )}
      </Field>
      <CustomSelect
        value={values.profession}
        fieldName={'profession'}
        label={'Profession'}
        options={profession}
        onChange={setFieldValue}
        onBlur={setFieldTouched}
        error={errors.profession}
        touched={touched.profession}
      />
      <RadioButtonGroup
        id="experience"
        label="Years of Experience"
        value={values.experience}
        error={errors.experience}
        touched={touched.experience}
      >
        {yearsOfExperienceOptions.map(option => (
          <Field
            key={option.value}
            id={option.value}
            component={RadioButton}
            name="experience"
            label={option.label}
          />  
        ))}
      </RadioButtonGroup>
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

      <Field name="notificationOfDataRelease">
        {({ field, form, meta }) => (
          <div>
            {/* Right now this is the only field that is not required. */}
            <label htmlFor="notificationOfDataRelease">Notify me when the data has been released.</label>
            <input
              id="notificationOfDataRelease"
              name="notificationOfDataRelease"
              type="checkbox"
              { ...field}
              defaultChecked={values.notificationOfDataRelease}
              value={values.notificationOfDataRelease}
            />
            {meta.touched &&
              meta.error && <div className="error">{meta.error}</div>}
          </div>
        )}
      </Field>

      <ConsentFactSheet/>

      <Field name="consent">
        {({ field, form, meta }) => (
          <div>
            {/* Right now this is the only field that is not required. */}
            <label htmlFor="consent">I have read and agree to the consent fact sheet.</label>
            <input
              id="consent"
              type="checkbox"
              { ...field }
              required
              defaultChecked={values.consent}
            />
            {meta.touched &&
              meta.error && <div className="error">{meta.error}</div>}
          </div>
        )}
      </Field>
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