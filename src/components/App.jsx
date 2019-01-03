import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../styles/app.css';
import AppLayout from './AppLayout';
import axios from 'axios';

class App extends Component {
  getImageDimensions(file) {
    return new Promise (function (resolved, rejected) {
      var i = new Image();
      i.onload = function(){
        resolved([i.width, i.height]);
      };
      i.src = file;
    });
  }

  render() {
    return (
      <div className="App">
        <AppLayout segmentationCallback={({imageURI, segmentationThreshold, segmentationDaw}) => {
          //return Promise.resolve([[0.1, 0.1, segmentationThreshold / 100, (segmentationDaw ? 0.5 : 0.8)]]);
          console.log(imageURI.substr(imageURI.indexOf(",") + 1));
          const req = axios.post("http://127.0.0.1:5000/addImage", {
            name: "image.jpg",
            payload: imageURI.substr(imageURI.indexOf(",") + 1),
            contrastFactor: 1,
            applyNoiseReduction: false,
            noiseReductionFactor: 1,
            segmentationFactor: segmentationThreshold / 100
          });
          let w, h;
          return this.getImageDimensions(imageURI).then(dimens => {
            [w, h] = dimens;
            console.log(dimens);
            return req;
          }).then(res => res.data.coords.map(([a, b, c, d]) => [a / w, b / h, (c - a) / w, (d - b) / h]));
        }} recognitionCallback={(args) => Promise.resolve({boxes: [], text: args.imageURI})}></AppLayout>
      </div>
    );
  }
}

export default App;