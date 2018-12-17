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
        this.state = {image: this.props.imageURI}
        this.imageEditor = React.createRef();
    }

    

    handleRotation(value) {
        this.imageEditor.current.rotateTo(value);
    }

    handleScaling(value) {
        this.imageEditor.current.scale(value);
    }

    handleHorizontalMoving(xPos) {
        const canvasData = this.imageEditor.current.getCanvasData();
        this.imageEditor.current.moveTo(xPos * canvasData.width, canvasData.top);
    }

    handleVerticalMoving(yPos) {
        const canvasData = this.imageEditor.current.getCanvasData();
        this.imageEditor.current.moveTo(canvasData.left, yPos * canvasData.height);
    }

    handleReset(){
        console.log('reset');
    }

    handleSubmit(e){
        const croppedImageData = this.imageEditor.current.getCroppedCanvas();
        this.props.onSubmit(croppedImageData);
    }

    render() {
        return (
            <div className="ia-container">
                <div className="ia-content-wrapper">
                    <div className="ia-left-column">
                        <div className="ia-image-editor-container">
                            {this.state.image &&
                                <ImageEditor
                                    ref={this.imageEditor}
                                    imageURI={this.state.image}

                                />}
                        </div>
                    </div>
                    <div className="ia-right-column">
                        <Sidekick 
                            title="Title"
                            currentPage={this.props.currentPage}
                            totalPages={this.props.totalPages}
                            onChange={this.props.onPageChange}
                            >
                            <SliderControl
                                label="Rotation"
                                iconName="sync-alt"
                                minValue={-90}
                                maxValue={90}
                                defaultValue={0}
                                step={0.01}
                                onChange={this.handleRotation.bind(this)}
                            />
                            <SliderControl
                                label="X-pos"
                                iconName="arrows-alt-h"
                                minValue={-1}
                                maxValue={1}
                                defaultValue={0}
                                step={0.01}
                                onChange={this.handleHorizontalMoving.bind(this)}
                            />
                            <SliderControl
                                label="Y-pos"
                                iconName="arrows-alt-v"
                                minValue={-1}
                                maxValue={1}
                                defaultValue={0}
                                step={0.01}
                                onChange={this.handleVerticalMoving.bind(this)}
                            />
                            <SliderControl
                                label="Scaling"
                                iconName="expand"
                                minValue={.5}
                                maxValue={1.5}
                                defaultValue={1}
                                step={0.01}
                                onChange={this.handleScaling.bind(this)}
                            />
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
    totalPages: PropTypes.number.isRequired
}
