import React from 'react';
import './App.css';
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import Logo from './Logo.js';

// Decode utf8 characters properly
let config = {};
try {
	config = JSON.parse(decodeURIComponent(escape(window.atob('@@config@@'))));	
  
  // Example for dev
  /*config = {
    "icon": "",
    "assetsUrl": "",
    "auth0Domain": "auth.crowds-cure.org",
    "auth0Tenant": "crowds-cure",
    "clientConfigurationBaseUrl": "https://cdn.auth0.com/",
    "callbackOnLocationHash": false,
    "callbackURL": "https://cancer.crowds-cure.org/auth/realms/dcm4che/broker/crowds-cure-cancer-auth0-oidc/endpoint",
    "cdn": "https://sdk.auth0.com/",
    "clientID": "z5cXMPTxeFOdB3i4xRA8JyhTonQmqMKM",
    "dict": {
      "signin": {
        "title": "Crowds Cure Cancer"
      }
    },
    "extraParams": {
      "protocol": "oauth2",
      "scope": "email profile openid",
      "response_type": "code",
      "nonce": "136ed843899e4baa821dc49ebb715b46",
      "_csrf": "bnBIr6i3-AEG6HF_oaGo09pAN5bOz5sRWJjc",
      "_intstate": "deprecated",
      "state": "g6Fo2SBpT1Z3aWZuZ1FFYlVYMnZKdWpLcHh1cm5mNGo4SGNMX6N0aWTZIEtWMjllZ2I3eHlSM1NjNDhuMzRfanpEMVp0MmxXdzNNo2NpZNkgejVjWE1QVHhlRk9kQjNpNHhSQThKeWhUb25RbXFNS00"
    },
    "internalOptions": {
      "protocol": "oauth2",
      "scope": "email profile openid",
      "response_type": "code",
      "nonce": "136ed843899e4baa821dc49ebb715b46",
      "_csrf": "bnBIr6i3-AEG6HF_oaGo09pAN5bOz5sRWJjc",
      "_intstate": "deprecated",
      "state": "g6Fo2SBpT1Z3aWZuZ1FFYlVYMnZKdWpLcHh1cm5mNGo4SGNMX6N0aWTZIEtWMjllZ2I3eHlSM1NjNDhuMzRfanpEMVp0MmxXdzNNo2NpZNkgejVjWE1QVHhlRk9kQjNpNHhSQThKeWhUb25RbXFNS00"
    },
    "widgetUrl": "https://cdn.auth0.com/w2/auth0-widget-5.1.min.js",
    "isThirdPartyClient": false,
    "authorizationServer": {
      "url": "https://auth.crowds-cure.org",
      "issuer": "https://auth.crowds-cure.org/"
    },
    "colors": {}
  };*/
} catch (error) {
	console.error(error);
}

console.warn(JSON.stringify(config, null, 2));

function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);	
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));	
}

var hash = getParameterByName('hash');
var initialPage = 'login';
if (hash && hash.toLowerCase() === '#signup') {	
  initialPage = 'signup';	
}

class App extends React.Component {
  state = {
    currentPage: initialPage
  }

  togglePage = (page) => {
    this.setState({ currentPage: page });
  }

  renderCurrentPage = () => {
    const { currentPage } = this.state;
    if (currentPage === 'signup') {
      return <SignUp config={config} togglePage={this.togglePage} />;
    } else {
      return <SignIn config={config} togglePage={this.togglePage} />;
    }
  }

  render() {
    return (
      <div className="App">
        <Logo />
        {this.renderCurrentPage()}
      </div>
    );
  }
}

export default App;
