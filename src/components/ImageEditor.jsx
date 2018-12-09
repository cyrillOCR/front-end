import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../styles/ImageEditor.css'

export default class ImageEditor extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.state = {
            bounds: {
                width: this.props.width || .5,
                height: this.props.height || .5,
                top: this.props.top || .25,
                left: this.props.left || .25
            },
            overlayStyle:{}
        };
        this.controlRect = React.createRef();
    }

    getRectLimits(rectBounds) {
        return {
            top: 1 - rectBounds.height,
            left: 1 - rectBounds.width,
            width: 1 - rectBounds.left,
            height: 1 - rectBounds.top
        }
    }

    updateOverlayStyle(){
        const canvas = this.canvas.current;
        const style = {
            top: canvas.offsetTop,
            right: 0,
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
            position: 'absolute'
        }
        this.setState({overlayStyle: style})
    }

    getRectBounds() {
        const canvas = this.canvas.current;
        const rect = this.controlRect.current;
        const newBounds = {
            top: rect.offsetTop / canvas.offsetHeight,
            left: rect.offsetLeft / canvas.offsetWidth,
            width: rect.offsetWidth / canvas.offsetWidth,
            height: rect.offsetHeight / canvas.offsetHeight
        }
        return newBounds;

    }

    getRectImage(bounds) {
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");
        const image = ctx.getImageData(
            bounds.left * canvas.width,
            bounds.top * canvas.height,
            bounds.width * canvas.width,
            bounds.height * canvas.height
        );
        let newCanvas = document.createElement('canvas');
        newCanvas.width = image.width;
        newCanvas.height = image.height;
        newCanvas.getContext("2d").putImageData(image, 0, 0);
        return newCanvas.toDataURL();
    }

    updateRect(bounds) {
        console.log('intra in updateRect');
        const newBounds = bounds || this.getRectBounds();
        const newLimits = this.getRectLimits(newBounds);
        this.setState({ bounds: newBounds, limits: newLimits })
        this.props.onChange({ bounds: newBounds, limits: newLimits });
    }

    componentDidMount() {
        // draw image when component mounts
        let image = new Image();
        image.onload = () => {
            //draw the image on canvas
            let canvas = this.canvas.current;
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext("2d").drawImage(image, 0, 0);

            // update rect proportions
            this.updateOverlayStyle();
            window.addEventListener('resize', this.updateOverlayStyle.bind(this));

            //call onChange callback so that the parent component will have initial values to pass to sliders
            const defaultLimits = this.getRectLimits(this.state.bounds);
            this.setState({limits: defaultLimits });
            this.props.onChange({ bounds: this.state.bounds, limits: this.state.limits });
        }
        image.src = this.props.imageURI;
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.updateOverlayStyle.bind(this));
    }

    render() {
        return (
            <div className="image-editor-container">
                <div className="canvas-container">
                    <canvas
                        className="image-editor-canvas"
                        ref={this.canvas}
                    ></canvas>
                    <div style={this.state.overlayStyle}>
                        <div 
                            style={{
                                top: this.state.bounds.top * 100 + '%',
                                left: this.state.bounds.left * 100 + '%',
                                width: this.state.bounds.width * 100 + '%',
                                height: this.state.bounds.height * 100 + '%'
                            }}
                            className="control-rect-container"
                            ref={this.controlRect}></div>
                    </div>
                </div>
            </div>
        )
    }
}

ImageEditor.propTypes = {
    imageURI: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}