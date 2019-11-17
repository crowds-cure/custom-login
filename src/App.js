import React from 'react';
import './App.css';
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';

// Decode utf8 characters properly
let config = {};
try {
	config = JSON.parse(decodeURIComponent(escape(window.atob('@@config@@'))));	
} catch (error) {
	console.error(error);
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

var hash = getParameterByName('hash');
console.warn('parameter hash is', hash);
var initialScreen = 'signUp';
if (hash && hash.toLowerCase() === '#login') {
    initialScreen = 'login';
} else if (hash && hash.toLowerCase() === '#signup') {
    initialScreen = 'signUp';
}

console.warn(JSON.stringify(config, null, 2));

function App(props) {
	console.warn(initialScreen);
  return (
    <div className="App">
      { initialScreen === 'login' ?
        <SignIn config={config}/> : 
        <SignUp config={config}/>
      }
      
    </div>
  );
}

export default App;
