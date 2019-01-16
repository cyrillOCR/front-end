import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import '../styles/ImageEditor.css'

export default class ImageEditor extends Component {
    constructor(props) {
        super(props);
        this.cropper = React.createRef()
        this.mirror = React.createRef()
        this.state = {}
    }

    getCanvasData() {
        return this.cropper.current.getCanvasData()
    }

    getCroppedCanvas() {
        return this.cropper.current.getCroppedCanvas().toDataURL()
    }

    getContainerData() {
        return this.cropper.current.getContainerData();
    }

    rotateTo(value) {
        this.cropper.current.rotateTo(value)
    }

    moveTo(x, y) {
        this.cropper.current.moveTo(x, y);
    }

    scale(value) {
        this.cropper.current.scale(value);
    }

    updateBoundings() {
        if (this.mirror.current)
            this.setState({
                style: {
                    height: this.mirror.current.clientHeight,
                    width: this.mirror.current.width
                }
            })
        if (this.cropper.current) this.cropper.current.reset()
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateBoundings.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateBoundings.bind(this));
    }

    render() {
        return (
            <div className="image-editor-container">
                <img
                    className="image-mirror"
                    src={this.props.imageURI}
                    ref={this.mirror}
                    alt=""
                    onLoad={this.updateBoundings.bind(this)}
                />
                {this.state.style &&
                    <Cropper
                        ref={this.cropper}
                        src={this.props.imageURI}
                        style={{
                            height: this.state.style.height,
                            position: 'absolute',
                            right: 0,
                            width: this.state.style.width
                        }}
                        zoomOnWheel={false}
                    />
                }
            </div>
        )
    }
}

ImageEditor.propTypes = {
    imageURI: PropTypes.string.isRequired
}