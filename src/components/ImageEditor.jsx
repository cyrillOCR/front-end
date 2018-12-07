import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../styles/ImageEditor.css'

export default class ImageEditor extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.controlRect = React.createRef();
    }

    getRectLimits(rectBounds) {
        const canvas = this.canvas.current;
        const limits = {
            top: canvas.height - rectBounds.height,
            left: canvas.width - rectBounds.width,
            width: canvas.width - rectBounds.left,
            height: canvas.height - rectBounds.top
        }
        return limits;
    }

    getRectBounds() {
        const controlRect = this.controlRect.current;
        return ({
            top: controlRect.offsetTop,
            left: controlRect.offsetLeft,
            width: controlRect.offsetWidth,
            height: controlRect.offsetHeight
        });
    }

    getRectImage(bounds) {
        const ctx = this.canvas.current.getContext("2d");
        const image = ctx.getImageData(
            bounds.left,
            bounds.top,
            bounds.width,
            bounds.height
        );
        let newCanvas = document.createElement('canvas');
        newCanvas.width = image.width;
        newCanvas.height = image.height;
        newCanvas.getContext("2d").putImageData(image, 0, 0);
        return newCanvas.toDataURL();
    }

    onRectUpdate() {
        const bounds = this.getRectBounds();
        const limits = this.getRectLimits(bounds);
        this.props.onChange({ bounds, limits });
    }

    /*
        Draw the image on the canvas when the component mounts
        Also, call the onChange callback with some default values.
    */
    componentDidMount() {
        // draw image when component mounts
        let image = new Image();
        image.onload = () => {
            let canvas = this.canvas.current;
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext("2d").drawImage(image, 0, 0);

            const defaultBounds = {
                width: image.width / 2,
                height: image.height / 2,
                top: image.height / 4,
                left: image.width / 4
            };
            const defaultLimits = this.getRectLimits(defaultBounds);
            this.props.onChange({ bounds: defaultBounds, limits: defaultLimits });
        }
        image.src = this.props.imageData;
    }

    render() {
        return (
            <div className="image-editor-container">
                <div className="canvas-container">
                    <canvas
                        className="image-editor-canvas"
                        ref={this.canvas}
                    ></canvas>
                    <div
                        style={{
                            top: this.props.top,
                            left: this.props.left,
                            width: this.props.width + 'px',
                            height: this.props.height + 'px'
                        }}
                        className="control-rect-container"
                        ref={this.controlRect}
                        onClick={() => this.onRectUpdate()}></div>
                </div>
            </div>
        )
    }
}

ImageEditor.propTypes = {
    imageData: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}