import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../styles/app.css';
import AppLayout from './AppLayout';
import axios from 'axios';

class App extends Component {
  getImageDimensions(file) {
    return new Promise(function (resolved, rejected) {
      var i = new Image();
      i.onload = function () {
        resolved([i.width, i.height]);
      };
      i.src = file;
    });
  }

  render() {
    return (
      <div className="App">
        <AppLayout segmentationCallback={
          ({ imageURI, contrastFactor, applyDilation, applyNoiseReduction, segmentationFactor, separationFactor }) => {
            //return Promise.resolve([[0.1, 0.1, segmentationThreshold / 100, (segmentationDaw ? 0.5 : 0.8)]]);
            console.log(imageURI);
            const req = axios.post("http://localhost:5000/addImage", {
              name: "image.jpg",
              payload: imageURI.substr(imageURI.indexOf(",") + 1),
              contrastFactor,
              applyDilation,
              applyNoiseReduction,
              segmentationFactor,
              separationFactor
            });
            let w, h;
            return this.getImageDimensions(imageURI).then(dimens => {
              [w, h] = dimens;
              console.log(dimens);
              return req;
            }).then(res => {
              const data = JSON.parse(res.data);
              console.log(data.payload);
              return {
                payload: data.payload.substr(1).replace('\'', ''), // b'<<base64>>' => <<base64>>
                coords: data.coords.map(([a, b, c, d]) => [a / w, b / h, (c - a) / w, (d - b) / h])
              }
            });
          }} recognitionCallback={(args) => Promise.resolve({ boxes: [], text: args.imageURI })}></AppLayout>
      </div >
    );
  }
}

export default App;