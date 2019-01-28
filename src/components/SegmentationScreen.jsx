import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../styles/SegmentationScreen.css';
import ImagePreview from '../components/ImagePreview';
import Sidekick from './Sidekick';
import SliderControl from './SliderControl';
import CheckboxControl from './CheckboxControl';
import ButtonsControl from './ButtonsControl';

class SegmentationScreen extends Component {
    constructor(props) {
        super(props);

        this.contrastFactorSlider = React.createRef();
        this.segmentationFactorSlider = React.createRef();
        this.separationFactorSlider = React.createRef();

        this.propsForSidekick = {
            title: 'Finding letters...'
        }

        this.propsForContrastFactorSlider = {
            maxValue: 3,
            minValue: 1,
            defaultValue: parseFloat(this.props.defaultValues.contrastFactor) || 1.5,
            step: 0.01,
            iconName: 'fas fa-adjust',
            label: 'Contrast'
        }

        this.propsForSegmentationFactorSlider = {
            maxValue: 0.7,
            minValue: 0.3,
            defaultValue: parseFloat(this.props.defaultValues.segmentationFactor) || 0.5,
            step: 0.01,
            iconName: 'fas fa-adjust',
            label: 'Segmentation'
        }

        this.propsForSeparationFactorSlider = {
            maxValue: 8,
            minValue: 2,
            defaultValue: parseInt(this.props.defaultValues.separationFactor, 10) || 3,
            step: 1,
            unit: 'px',
            iconName: 'fas fa-adjust',
            label: 'Separation'
        }

        this.propsForApplyDilationCheckbox = {
            defaultValue: this.props.defaultValues.applyDilation || false,
            label: 'Dilation',
            tooltipText: 'Better character spotting, increases the execution time.'
        }

        this.propsForApplyNoiseReductionCheckbox = {
            defaultValue: this.props.defaultValues.applyNoiseReduction || false,
            label: 'Noise Reduction',
            tooltipText: 'Image noise reduction, increases the execution time.'
        }

        this.propsForButtonsControl = {
            primaryLabel: 'Recognize text',
            secondaryLabel: 'Reset options',
            auxiliaryLabel: 'Adjust image',
            iconLabel: 'fas fa-search'
        }
    }

    handleReset() {
        if (this.contrastFactorSlider.current) this.contrastFactorSlider.current.handleReset();
        if (this.segmentationFactorSlider.current) this.segmentationFactorSlider.current.handleReset();
        if (this.separationFactorSlider.current) this.separationFactorSlider.current.handleReset();
    }

    render() {
        var imagePreview = null;

        if (this.props.imageURI) {
            imagePreview = <ImagePreview imageURI={this.props.imageURI} boxes={this.props.boxes} />
        }

        return (
            <div className="s-container">
                <div className="s-content-wrapper">
                    <div className="s-left-column">
                        <div className="s-image-preview">
                            {imagePreview}
                        </div>
                    </div>
                    <div className="s-right-column">
                        <Sidekick
                            title={this.propsForSidekick.title}
                            onChange={this.props.onChangePage}
                            currentPage={this.props.currentPage}
                            totalPages={this.props.totalPages}>
                            <div className="s-slider-control-container">
                                <SliderControl
                                    {...this.propsForContrastFactorSlider}
                                    onChange={this.props.onChangeContrastFactor}
                                    ref={this.contrastFactorSlider}
                                    update='final' />
                            </div>

                            <div className="s-slider-control-container">
                                <SliderControl
                                    {...this.propsForSegmentationFactorSlider}
                                    onChange={this.props.onChangeSegmentationFactor}
                                    ref={this.segmentationFactorSlider}
                                    update='final' />

                                <SliderControl
                                    {...this.propsForSeparationFactorSlider}
                                    onChange={this.props.onChangeSeparationFactor}
                                    ref={this.separationFactorSlider}
                                    update='final' />
                            </div>


                            <div className="s-checkbox-control-container">
                                <CheckboxControl
                                    {...this.propsForApplyDilationCheckbox}
                                    onChange={this.props.onChangeApplyDilation} />
                            </div>

                            <div className="s-checkbox-control-container">
                                <CheckboxControl
                                    {...this.propsForApplyNoiseReductionCheckbox}
                                    onChange={this.props.onChangeApplyNoiseReduction} />
                            </div>
                            <ButtonsControl
                                handlePrimary={this.props.handlePrimary}
                                handleSecondary={this.props.handleReset}
                                handleAuxiliary={this.props.handleAuxiliary}
                                {...this.propsForButtonsControl} />
                        </Sidekick>
                    </div>
                </div>
            </div>
        );
    }
}

SegmentationScreen.propTypes = {
    imageURI: PropTypes.string.isRequired,
    boxes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    handlePrimary: PropTypes.func.isRequired,
    handleAuxiliary: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeApplyDilation: PropTypes.func.isRequired,
    onChangeApplyNoiseReduction: PropTypes.func.isRequired,
    onChangeContrastFactor: PropTypes.func.isRequired,
    onChangeSegmentationFactor: PropTypes.func.isRequired,
    onChangeSeparationFactor: PropTypes.func.isRequired,
    defaultValues: PropTypes.object,
    handleReset: PropTypes.func.isRequired
}

export default SegmentationScreen;