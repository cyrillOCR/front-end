import React, { Component } from 'react';
import '../styles/app.css';
import AppLayout from './AppLayout';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.imageUploadCallbackBound = this.imageUploadCallback.bind(this);
    this.segmentationCallbackBound = this.segmentationCallback.bind(this);
    this.recognitionCallbackBound = this.recognitionCallback.bind(this);
    this.state = {
      data: {},
      loading: false
    }
  }

  getImageDimensions(file) {
    return new Promise(function (resolved, rejected) {
      var i = new Image();
      i.onload = function () {
        resolved([i.width, i.height]);
      };
      i.src = file;
    });
  }

  getDocType(imageURI) {
    return imageURI.split(';')[0].split(':')[1];
  }

  updateOriginalImage(page, originalImage) {
    let oldData = this.state.data;
    if (!oldData[page]) oldData[page] = {};
    if (oldData[page].original !== originalImage) {
      oldData[page].original = originalImage;
      oldData[page].shouldRequest = true;
      this.setState({ data: oldData });
      console.log('updated original', this.state)
    }
  }

  updateAdjustedImage(page, adjustedImage) {
    let oldData = this.state.data;
    if (!oldData[page]) oldData[page] = {};
    if (oldData[page].adjusted !== adjustedImage) {
      oldData[page].adjusted = adjustedImage;
      oldData[page].shouldRequest = true;
      this.setState({ data: oldData });
      console.log('updated adjusted', this.state);
    }
  }

  updateProcessedImage(page, processedImage) {
    let oldData = this.state.data;
    if (!oldData[page]) oldData[page] = {};
    if (oldData[page].processed !== processedImage) {
      oldData[page].processed = processedImage;
      this.setState({ data: oldData });
      console.log('updated processed', this.state);
    }
  }

  updateCoords(page, coords) {
    let oldData = this.state.data;
    if (!oldData[page]) oldData[page] = {};
    if (!oldData[page].coords) oldData[page].coords = [];
    if (oldData[page].coords.length !== coords.length) {
      oldData[page].coords = coords;
      this.setState({ data: oldData })
      console.log('updated coords', this.state);
    }
  }

  updateConfigValue(page, property, value) {
    let oldData = this.state.data;
    if (!oldData[page]) oldData[page] = {};
    if (!oldData[page].configValues) oldData[page].configValues = {};
    if (oldData[page].configValues[property] !== value) {
      oldData[page].configValues[property] = value;
      oldData[page].shouldRequest = true;
      this.setState({ data: oldData });
      console.log('updated config val', property, this.state);
    }
  }

  updateRecognizedText(page, text) {
    let oldData = this.state.data;
    if (!oldData[page]) oldData[page] = {};
    oldData[page].text = text;
    this.setState({ data: oldData });
  }

  imageUploadCallback(files) {
    return new Promise((resolved, rejected) => {
      let file = new FileReader();
      file.onload = (fileLoadedEv) => {
        resolved(fileLoadedEv.target.result);
      }
      file.readAsDataURL(files[0]);
      this.setState({ loading: true });
    }).then((docURI) => {
      const docType = this.getDocType(docURI);
      //if doc mimetype is image, return image URI
      if (docType.split('/')[0] === 'image') {
        this.setState({ loading: false });
        return Promise.resolve([docURI]);
      }
      //post request to addPdf if doc is PDF
      console.log(docURI.split(',')[1]);

      return axios.post('http://localhost:5000/convertPdf', {
        name: "doc.pdf",
        payload: docURI.split(',')[1]
      }).then(response => {
        const data = JSON.parse(response.data);
        console.log(data.payloads);
        this.setState({ loading: false })
        return Promise.resolve(data.payloads.map(pload => 'data:image/png;base64,' + pload));
      })
    })
  }

  shouldProcessRequest(page, contrastFactor, applyDilation, applyNoiseReduction, segmentationFactor, separationFactor) {
    this.updateConfigValue(page, 'contrastFactor', contrastFactor);
    this.updateConfigValue(page, 'segmentationFactor', segmentationFactor);
    this.updateConfigValue(page, 'separationFactor', separationFactor);
    this.updateConfigValue(page, 'applyDilation', applyDilation);
    this.updateConfigValue(page, 'applyNoiseReduction', applyNoiseReduction);
    console.log(this.state.data, page);
    if (this.state.data[page].shouldRequest) {
      let oldData = this.state.data;
      oldData[page].shouldRequest = false;
      this.setState({ data: oldData });
      console.log('do request');
      return true;
    }
    console.log('dont request');
    return false;
  }

  segmentationCallback({ page, imageURI, contrastFactor, applyDilation, applyNoiseReduction, segmentationFactor, separationFactor }) {
    //return Promise.resolve([[0.1, 0.1, segmentationThreshold / 100, (segmentationDaw ? 0.5 : 0.8)]]);

    if (!this.shouldProcessRequest(page, contrastFactor, applyDilation, applyNoiseReduction, segmentationFactor, separationFactor)) {
      return this.getImageDimensions(imageURI).then((dimens) => {
        [w, h] = dimens;

        return {
          payload: 'data:image/png;base64,' + this.state.data[page].processed,
          coords: (this.state.data[page].coords || []).map(([a, b, c, d]) => [a / w, b / h, (c - a) / w, (d - b) / h])
        }
      })
    }

    const req = axios.post("http://localhost:5000/addImage", {
      name: "image.jpg",
      payload: imageURI.substr(imageURI.indexOf(",") + 1),
      contrastFactor: parseFloat(contrastFactor),
      applyDilation,
      applyNoiseReduction,
      segmentationFactor: parseFloat(segmentationFactor),
      separationFactor: parseFloat(separationFactor)
    });

    console.log('request cu :', '<<imageURI>>', contrastFactor, applyDilation, applyNoiseReduction, segmentationFactor, separationFactor);
    let w, h;
    return this.getImageDimensions(imageURI).then(dimens => {
      [w, h] = dimens;
      console.log(dimens);
      return req;
    }).then(res => {
      const data = JSON.parse(res.data);
      data.payload = data.payload.substr(1).split('\'').join(''); // b'<<base64>>' => <<base64>>
      this.updateProcessedImage(page, data.payload);
      this.updateCoords(page, data.coords);
      // console.log('payload after:', data.payload);
      // console.log(data.coords);
      return {
        payload: 'data:image/png;base64,' + data.payload,
        coords: data.coords.map(([a, b, c, d]) => [a / w, b / h, (c - a) / w, (d - b) / h])
      }
    });
  }

  recognitionCallback(args) {
    return Promise.resolve({ boxes: [], text: args.imageURI })
  }

  render() {
    return (
      <div className="App">
        <AppLayout
          imageUploadCallback={this.imageUploadCallbackBound}
          segmentationCallback={this.segmentationCallbackBound}
          recognitionCallback={this.recognitionCallbackBound}
          updateOriginalImage={this.updateOriginalImage.bind(this)}
          updateAdjustedImage={this.updateAdjustedImage.bind(this)}
          updateRecognizedText={this.updateRecognizedText.bind(this)}
          updateConfigValue={this.updateConfigValue.bind(this)}
          loading={this.state.loading}
          data={this.state.data}
        />
      </div>
    );
  }
}

export default App;