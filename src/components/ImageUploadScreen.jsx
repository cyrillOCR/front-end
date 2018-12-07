import React, { Component }  from 'react';

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
                        <h2>Lorem ipsum dolor sit AMET dolor</h2>
                        <div className="how-to-container">
                            <h3>How to use:</h3>
                            <span>
                                You can get started just by uploading 
                                a picture over there. Once the picture is
                                uploaded, adjust it by cropping and rotating,
                                and then submit it to our powerful OCR so it 
                                can get the text from your dusty old documents.
                            </span>
                            <h3>Our application can do:</h3>
                            <div>
                                <ul>
                                    <li>this cool feature</li>
                                    <li>other amazing feature</li>
                                    <li>can also do this</li>
                                    <li>and that</li>                                    
                                </ul>
                            </div>
                        </div>
                    </article>

                </div>
                
                <div className="image-uploader-container">
                    <div className="image-uploader">       
                        <ImageUploader/>
                    </div>
                
                </div>
            </div>    
        );
    }
}