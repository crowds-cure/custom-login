import React from 'react';
import { useFormik } from 'formik';
import auth0 from 'auth0-js';

const SignUp = () => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    onSubmit: values => {
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
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.firstName}
      />
      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.lastName}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignUp;