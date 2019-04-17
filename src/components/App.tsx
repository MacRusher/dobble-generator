import React, { Component } from 'react';

import Footer from './Footer';
import Header from './Header';
import List from './List';

class App extends Component {
  public render() {
    return (
      <div>
        <Header />
        <List />
        <Footer />
      </div>
    );
  }
}

export default App;
