import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImageEditor from './ImageEditor'
import SliderControl from './SliderControl'
import Sidekick from './Sidekick'
import ButtonsControl from './ButtonsControl'
import '../styles/ImageAdjustmentScreen.css'

export default class ImageAdjustmentScreen extends Component {
    constructor(props) {
        super(props);
        this.imageEditor = React.createRef();
        this.sliders = {
            scale: React.createRef(),
            rotation: React.createRef(),
            posX: React.createRef(),
            posY: React.createRef()
        }
    }

    handleRotation(value) {
        if (!this.imageEditor.current) return;
        this.imageEditor.current.rotateTo(value);
    }

    handleScaling(value) {
        if (!this.imageEditor.current) return;
        this.imageEditor.current.scale(value);
    }

    handleHorizontalMoving(xPos) {
        if (!this.imageEditor.current) return;
        const canvasData = this.imageEditor.current.getCanvasData();
        this.imageEditor.current.moveTo(xPos * canvasData.width / 100, canvasData.top);
    }

    handleVerticalMoving(yPos) {
        if (!this.imageEditor.current) return;
        const canvasData = this.imageEditor.current.getCanvasData();
        this.imageEditor.current.moveTo(canvasData.left, yPos * canvasData.height / 100);
    }

    handleReset() {
        for (const slider in this.sliders) {
            this.sliders[slider].current.handleReset();
        }
    }

    handleSubmit(e) {
        const croppedImageData = this.imageEditor.current.getCroppedCanvas();
        this.props.onSubmit(croppedImageData);
    }

    render() {
        return (
            <div className="ia-container">
                <div className="ia-content-wrapper">
                    <div className="ia-left-column">
                        <div className="ia-image-editor-container">
                            {this.props.imageURI &&
                                <ImageEditor
                                    ref={this.imageEditor}
                                    imageURI={this.props.imageURI}
                                />}
                        </div>
                    </div>
                    <div className="ia-right-column">
                        <Sidekick
                            title={this.props.title || 'Image adjusting...'}
                            currentPage={this.props.currentPage}
                            totalPages={this.props.totalPages}
                            onChange={this.props.onPageChange}
                        >
                            <div className="ia-slider-control-container">
                                <SliderControl
                                    label="Rotation"
                                    iconName="sync-alt"
                                    minValue={-90}
                                    maxValue={90}
                                    defaultValue={0}
                                    step={0.01}
                                    onChange={this.handleRotation.bind(this)}
                                    ref={this.sliders.rotation}
                                    unit='deg'
                                />
                            </div>
                            <div className="ia-slider-control-container">
                                <SliderControl
                                    label="Position-X"
                                    iconName="arrows-alt-h"
                                    minValue={-100}
                                    maxValue={100}
                                    defaultValue={0}
                                    step={0.01}
                                    unit='%'
                                    onChange={this.handleHorizontalMoving.bind(this)}
                                    ref={this.sliders.posX}
                                />
                                <SliderControl
                                    label="Position-Y"
                                    iconName="arrows-alt-v"
                                    minValue={-100}
                                    maxValue={100}
                                    defaultValue={0}
                                    step={0.01}
                                    unit='%'
                                    onChange={this.handleVerticalMoving.bind(this)}
                                    ref={this.sliders.posY}
                                />
                            </div>
                            <div className="ia-slider-control-container">
                                <SliderControl
                                    label="Scale"
                                    iconName="expand"
                                    minValue={.5}
                                    maxValue={1.5}
                                    defaultValue={1}
                                    step={0.01}
                                    onChange={this.handleScaling.bind(this)}
                                    ref={this.sliders.scale}
                                />
                            </div>
                            <ButtonsControl
                                primaryLabel="Save"
                                iconLabel="check"
                                secondaryLabel="Cancel"
                                auxiliaryLabel="Reset"
                                handlePrimary={this.handleSubmit.bind(this)}
                                handleSecondary={this.props.onCancel}
                                handleAuxiliary={this.handleReset.bind(this)}
                            />
                        </Sidekick>
                    </div>
                </div>
            </div>
        )
    }
}

ImageAdjustmentScreen.propTypes = {
    imageURI: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    title: PropTypes.string
}
