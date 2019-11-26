import React from 'react';
import './App.css';
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import Logo from './Logo.js';

// Decode utf8 characters properly
let config = {};
try {
	config = JSON.parse(decodeURIComponent(escape(window.atob('@@config@@'))));	
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

  constructor() {
    super();

    this.state = {
      currentPage: initialPage
    };

    this.togglePage = this.togglePage.bind(this);
    this.renderCurrentPage = this.renderCurrentPage.bind(this);
  }

  togglePage(page) {
    this.setState({ currentPage: page });
  }

  renderCurrentPage() {
    const { currentPage } = this.state;
    if (currentPage !== 'sign') {
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
