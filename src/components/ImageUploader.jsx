import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types'

import "../styles/ImageUploader.css";
import { dropzoneActive, dropzoneArea } from '../styles/dropzoneStyle';

export default class ImageUploader extends Component {
    constructor(props) {
        super(props)
      }

      onDrop(files) {
        this.props.callback(files);
      }
    
      onCancel() {
      }

    render() {
        return (
            <div className="dropzone">
                <Dropzone onDrop={this.onDrop.bind(this)}
                    onFileDialogCancel={this.onCancel.bind(this)}  
                    style={dropzoneArea} activeStyle={dropzoneActive}>
                    <div className="upload-placeholder">
                        <span className="fa-stack ">
                            <i className="far fa-file fa-stack-2x"></i>
                            <i className="fas fa-arrow-up fa-stack-1x"></i>
                        </span>   
                        <span className="upload-text">Drop your image here or click to browse</span>
                    </div>
                </Dropzone>
            </div>
        ) 
    }
}


ImageUploader.propTypes = {
    callblack: PropTypes.func.isRequired
}