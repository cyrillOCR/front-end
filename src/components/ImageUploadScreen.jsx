import React, { Component }  from 'react';
import PropTypes from 'prop-types'

import "../styles/ImageUploadScreen.css";
import ImageUploader from './ImageUploader'; 
import logo from '../assets/logo.svg';

export default class ImageUploadScreen extends Component {

    render() {
        return ( 
            <div className="image-upload-screen-container">
                <div className="about-app-container">
                    <header>
                        <img src={logo} className="App-logo" alt="logo" />
                    </header>
                    <article className="about-app">
                        <h2>Cyrillic Character Recognition</h2>
                        <div className="how-to-container">
                            <h3>How it works:</h3>
                            <span>
                               <ul>
                                   <li>Upload your document containing cyrillic characters</li>
                                   <li>Adjust the page (scale, crop, rotate)</li>
                                   <li>Make sure the letters are accurately highlighted</li>
                                   <li>Extract the text</li>
                               </ul>
                            </span>
                            <h3>Supported formats:</h3>
                            <span>
                                Upload <strong>PDF</strong>, <strong>JPG</strong> or <strong>PNG</strong> files.
                            </span>
                        </div>
                    </article>

                </div>
                
                <div className="image-uploader-container">
                    <div className="image-uploader">       
                        <ImageUploader callback={this.props.callback}/>
                    </div>
                </div>
            </div>    
        );
    }
}

ImageUploadScreen.propTypes = {
    callback: PropTypes.func.isRequired
}