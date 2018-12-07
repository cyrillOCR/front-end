import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import "../styles/ImageUploader.css";
import { dropzoneActive, dropzoneArea } from '../styles/dropzoneStyle';

export default class ImageUploader extends Component {
    constructor() {
        super()
        this.state = { files: [] }
      }

      onDrop(files) {
        this.setState({
          files
        });

        this.state.files.map(f => { console.log(f)});
      }
    
      onCancel() {
        this.setState({
          files: []
        });
      }

    render() {
        return (
            <div className="dropzone">
                <Dropzone onDrop={this.onDrop.bind(this)}
            onFileDialogCancel={this.onCancel.bind(this)}  style={dropzoneArea} activeStyle={dropzoneActive}>
                    <div className="upload-placeholder">
                        <span className="fas fa-upload"></span>
                        <span className="upload-text">Drop your image here or click to browse</span>
                    </div>
                </Dropzone>
            </div>
        ) 
    }
}