import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../styles/app.css';
import AppLayout from './AppLayout';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppLayout segmentationCallback={({ segmentationThreshold, segmentationDaw }) => {
          return Promise.resolve([[0.1, 0.1, segmentationThreshold / 100, (segmentationDaw ? 0.5 : 0.8)]]);
        }} recognitionCallback={(args) => Promise.resolve({boxes: [], text: args.imageURI})}></AppLayout>
      </div>
    );
  }
}

export default App;