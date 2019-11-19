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

class App extends React.Component {

  constructor() {
    super();

    this.state = {
      currentPage: 'login'
    };

    this.togglePage = this.togglePage.bind(this);
    this.renderCurrentPage = this.renderCurrentPage.bind(this);
  }

  togglePage(page) {
    this.setState({ currentPage: page });
  }

  renderCurrentPage() {
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
