import React from 'react';
import { useFormik } from 'formik';
import auth0 from 'auth0-js';

const SignIn = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      console.log(JSON.stringify(values, null, 2));
      const { email, password } = values;

      // Initialize client
      const webAuth = new auth0.WebAuth({
        domain: 'crowds-cure.auth0.com',
        clientID: 'z5cXMPTxeFOdB3i4xRA8JyhTonQmqMKM'
      });
      const options = { 
        connection: 'Username-Password-Authentication',
        password,
      };

      const isEmail = email.includes('@');
      if (isEmail) {
          options.email = email;
      } else {
          options.username = email;
      }
      
      webAuth.login(options, function (err) { 
        if (err) return alert('Something went wrong: ' + err.message); 
          return alert('success signup without login!') 
      });
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignIn;