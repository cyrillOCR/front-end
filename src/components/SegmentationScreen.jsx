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

        this.propsForSidekick = {
            title: 'Finding letters...'
        }

        this.propsForContrastFactorSlider = {
            maxValue: 3,
            minValue: 1,
            defaultValue: 1.5,
            step: 0.01,
            iconName: 'fas fa-adjust',
            label: 'Contrast'
        }

        this.propsForSegmentationFactorSlider = {
            maxValue: 0.7,
            minValue: 0.3,
            defaultValue: 0.5,
            step: 0.01,
            iconName: 'fas fa-adjust',
            label: 'Segmentaion'
        }

        this.propsForSeparationFactorSlider = {
            maxValue: 8,
            minValue: 2,
            defaultValue: 3,
            step: 1,
            unit: 'px',
            iconName: 'fas fa-adjust',
            label: 'Separation'
        }

        this.propsForApplyDilationCheckbox = {
            defaultValue: true,
            label: 'Dilation',
            toolTipText: 
                `Dilation can be true or false, by default is true. 
                If set, it dilates and erosions the characters, making them more clear,
                but has very long execution time.`
        }

        this.propsForApplyNoiseReductionCheckbox = {
            defaultValue: false,
            label: 'Noise Reduction',
            toolTipText: 
                `NoiseReduction can be false or true, by default it is false. 
                If set, it totally removes the noise of the image, making it 
                sharp and clear but increases the execution time.`
        }

        this.propsForButtonsControl = {
            primaryLabel: 'Recognize text',
            secondaryLabel: 'Reset options',
            auxiliaryLabel: 'Adjust image',
            iconLabel: 'fas fa-search'
        }
    }
    
    render() {
        const { 
            imageURI,
            boxes,
            currentPage,
            totalPages,
            handlePrimary, 
            handleSecondary, 
            handleAuxiliary,
            onChangePage,
            onChangeApplyDilation,
            onChangeApplyNoiseReduction,
            onChangeContrastFactor,
            onChangeSegmentationFactor,
            onChangeSeparationFactor
        } = this.props; 
        var imagePreview = null;
        
        if (imageURI) {
            imagePreview = <ImagePreview imageURI={imageURI} boxes={boxes}/>
        }
 
        return (    
            <div className="segmentation-screen-container">
                <div className="image-preview-container">
                    {imagePreview}
                </div>
                <div className="sidekick-container-parent">
                    <Sidekick 
                        title={this.propsForSidekick.title} 
                        onChange={onChangePage} 
                        currentPage={currentPage} 
                        totalPages={totalPages}>
                        <div className="slider-control">
                            <SliderControl
                                maxValue={this.propsForContrastFactorSlider.maxValue} 
                                minValue={this.propsForContrastFactorSlider.minValue}
                                defaultValue={this.propsForContrastFactorSlider.defaultValue} 
                                iconName={this.propsForContrastFactorSlider.iconName} 
                                label={this.propsForContrastFactorSlider.label} 
                                unit={this.propsForContrastFactorSlider.unit}
                                step={this.propsForContrastFactorSlider.step} 
                                onChange={onChangeContrastFactor} />
                        </div>

                        <div className="slider-control">
                            <SliderControl
                                maxValue={this.propsForSegmentationFactorSlider.maxValue} 
                                minValue={this.propsForSegmentationFactorSlider.minValue}
                                defaultValue={this.propsForSegmentationFactorSlider.defaultValue} 
                                iconName={this.propsForSegmentationFactorSlider.iconName} 
                                label={this.propsForSegmentationFactorSlider.label} 
                                unit={this.propsForSegmentationFactorSlider.unit}
                                step={this.propsForSegmentationFactorSlider.step} 
                                onChange={onChangeSegmentationFactor} />
                        </div>

                        <div className="slider-control">
                            <SliderControl
                                maxValue={this.propsForSeparationFactorSlider.maxValue} 
                                minValue={this.propsForSeparationFactorSlider.minValue}
                                defaultValue={this.propsForSeparationFactorSlider.defaultValue} 
                                iconName={this.propsForSeparationFactorSlider.iconName} 
                                label={this.propsForSeparationFactorSlider.label} 
                                unit={this.propsForSeparationFactorSlider.unit}
                                step={this.propsForSeparationFactorSlider.step} 
                                onChange={onChangeSeparationFactor} />
                        </div>


                        <div className="checkbox-control">
                            <CheckboxControl
                                defaultValue={this.propsForApplyDilationCheckbox.defaultValue}
                                label={this.propsForApplyDilationCheckbox.label}
                                tooltipText={this.propsForApplyDilationCheckbox.toolTipText}
                                onChange={onChangeApplyDilation} />
                        </div>

                        <div className="checkbox-control">
                            <CheckboxControl
                                defaultValue={this.propsForApplyNoiseReductionCheckbox.defaultValue}
                                label={this.propsForApplyNoiseReductionCheckbox.label}
                                tooltipText={this.propsForApplyNoiseReductionCheckbox.toolTipText}
                                onChange={onChangeApplyNoiseReduction} />
                        </div>
                        
                        <div className="buttons-control">
                            <ButtonsControl
                                handlePrimary={handlePrimary}
                                handleSecondary={handleSecondary}
                                handleAuxiliary={handleAuxiliary}
                                primaryLabel={this.propsForButtonsControl.primaryLabel}
                                secondaryLabel={this.propsForButtonsControl.secondaryLabel}
                                auxiliaryLabel={this.propsForButtonsControl.auxiliaryLabel}
                                iconLabel={this.propsForButtonsControl.iconLabel}/>
                        </div>
                    </Sidekick>
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
    handleSecondary: PropTypes.func.isRequired, 
    handleAuxiliary: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeDilation: PropTypes.func.isRequired,
    onChangeNoiseReduction: PropTypes.func.isRequired,
    onChangeContrastFactor: PropTypes.func.isRequired,
    onChangeSegmentationFactor: PropTypes.func.isRequired,
    onChangeSeparationFactor: PropTypes.func.isRequired
}

export default SegmentationScreen;