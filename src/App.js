import React from 'react';
import './App.css';
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';

// Decode utf8 characters properly
/*var config = JSON.parse(decodeURIComponent(escape(window.atob('@@config@@'))));
config.extraParams = config.extraParams || {};
var connection = config.connection;
var prompt = config.prompt;
var languageDictionary;
var language;

if (config.dict && config.dict.signin && config.dict.signin.title) {
    languageDictionary = { title: config.dict.signin.title };
} else if (typeof config.dict === 'string') {
    language = config.dict;
}
var loginHint = config.extraParams.login_hint;

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}*/

function App() {
  return (
    <div className="App">
      <h2>Sign In</h2>
      <SignIn/>
      <hr/>
      <h2>Sign Up</h2>
      <SignUp/>
    </div>
  );
}

export default App;
