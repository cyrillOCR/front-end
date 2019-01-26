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
    }
  }

  updateAdjustedImage(page, adjustedImage) {
    let oldData = this.state.data;
    if (!oldData[page]) oldData[page] = {};
    oldData[page].adjusted = adjustedImage;
    oldData[page].processedImage = undefined;
    oldData[page].coords = undefined;
    oldData[page].configValues = undefined;
    this.setState({ data: oldData });
  }

  updateProcessedImage(page, processedImage) {
    let oldData = this.state.data;
    if (!oldData[page]) oldData[page] = {};
    if (oldData[page].processed !== processedImage) {
      oldData[page].processed = processedImage;
      oldData[page].featureRequest = true;
      this.setState({ data: oldData });
    }
  }

  updateCoords(page, coords) {
    let oldData = this.state.data;
    if (!oldData[page]) oldData[page] = {};
    if (!oldData[page].coords) oldData[page].coords = [];
    if (oldData[page].coords.length !== coords.length) {
      oldData[page].coords = coords;
      oldData[page].featureRequest = true;
      this.setState({ data: oldData })
    }
  }

  updateWordsCoords(page, coords) {
    let oldData = this.state.data;
    if (!oldData[page]) oldData[page] = {};
    if (!oldData[page].wordsCoords) oldData[page].wordsCoords = [];
    if (oldData[page].wordsCoords.length !== coords.length) {
      oldData[page].wordsCoords = coords;
      this.setState({ data: oldData })
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
      return axios.post('https://neco.serveo.net/convertPdf', {
        // return axios.post('http://localhost:5000/convertPdf', {
        name: "doc.pdf",
        payload: docURI.split(',')[1]
      }).then(response => {
        const data = JSON.parse(response.data);
        this.setState({ loading: false })
        return Promise.resolve(data.payloads.map(pload => 'data:image/png;base64,' + pload));
      }).catch(err => {
        this.setState({ loading: false });
        return Promise.reject(err);
      })
    })
  }

  shouldProcessRequest(page, contrastFactor, applyDilation, applyNoiseReduction, segmentationFactor, separationFactor) {
    this.updateConfigValue(page, 'contrastFactor', contrastFactor);
    this.updateConfigValue(page, 'segmentationFactor', segmentationFactor);
    this.updateConfigValue(page, 'separationFactor', separationFactor);
    this.updateConfigValue(page, 'applyDilation', applyDilation);
    this.updateConfigValue(page, 'applyNoiseReduction', applyNoiseReduction);
    if (this.state.data[page].shouldRequest) {
      let oldData = this.state.data;
      oldData[page].shouldRequest = false;
      this.setState({ data: oldData });
      return true;
    }
    return false;
  }

  segmentationCallback({ page, imageURI, contrastFactor, applyDilation, applyNoiseReduction, segmentationFactor, separationFactor }) {
    //return Promise.resolve([[0.1, 0.1, segmentationThreshold / 100, (segmentationDaw ? 0.5 : 0.8)]]);

    if (!this.shouldProcessRequest(page, contrastFactor, applyDilation, applyNoiseReduction, segmentationFactor, separationFactor)) {
      const processedImage = 'data:image/png;base64,' + this.state.data[page].processed;
      return this.getImageDimensions(processedImage).then((dimens) => {
        const [w, h] = dimens;
        return {
          payload: processedImage,
          coords: (this.state.data[page].coords || []).map(([a, b, c, d]) => [a / w, b / h, (c - a) / w, (d - b) / h])
        }
      })
    }
    return axios.post("https://neco.serveo.net/addImage", {
      // return axios.post("http://localhost:5000/addImage", {
      name: "image.jpg",
      payload: imageURI.substr(imageURI.indexOf(",") + 1),
      contrastFactor: parseFloat(contrastFactor),
      applyDilation,
      applyNoiseReduction,
      segmentationFactor: parseFloat(segmentationFactor),
      separationFactor: parseFloat(separationFactor)
    }).then(res => {
      const data = JSON.parse(res.data);
      data.payload = data.payload.substr(1).split('\'').join(''); // b'<<base64>>' => <<base64>>
      this.updateProcessedImage(page, data.payload);
      this.updateCoords(page, data.coords);
      return this.getImageDimensions('data:image/png;base64,' + data.payload).then(dimens => {
        const [w, h] = dimens;
        return {
          payload: 'data:image/png;base64,' + data.payload,
          coords: data.coords.map(([a, b, c, d]) => [a / w, b / h, (c - a) / w, (d - b) / h])
        }
      })
    });
  }

  shouldFeatureRequest(page) {
    if (this.state.data[page].featureRequest) {
      let oldData = this.state.data;
      oldData[page].featureRequest = false;
      this.setState({ data: oldData });
      return true;
    }
    return false;
  }

  recognitionCallback({ page, imageURI }) {
    let processedImage = this.state.data[page].processed;
    let coords = this.state.data[page].coords;
    if (!this.shouldFeatureRequest(page)) {
      let adjustedImage = this.state.data[page].adjusted;
      let coords = this.state.data[page].wordsCoords;
      let text = this.state.data[page].text;
      return this.getImageDimensions('data:image/png;base64,' + processedImage).then(dimens => {
        const [w, h] = dimens;
        return { coords: coords.map(([a, b, c, d]) => [a / w, b / h, (c - a) / w, (d - b) / h]), processedImage: adjustedImage, text }
      })
    }
    // return Promise.resolve({ boxes: [], text: args.imageURI })
    return axios.post('https://miscui.serveo.net', {
      // return axios.post('http://192.168.0.103:5050/feature', {
      coords: coords,
      base64: processedImage
    }).then(response => {
      let data = response.data;
      let coords = [];
      let words = [];
      for (let value of data) {
        coords.push(value[0]);
        words.push(value[1]);
      }
      this.setState({ loading: false })
      this.updateRecognizedText(page, words);
      this.updateWordsCoords(page, coords);
      return this.getImageDimensions('data:image/png;base64,' + processedImage).then(dimens => {
        const [w, h] = dimens;
        return {
          coords: coords.map(([a, b, c, d]) => [a / w, b / h, (c - a) / w, (d - b) / h]),
          processedImage: imageURI, 
          text: words
        };
      })
    });
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