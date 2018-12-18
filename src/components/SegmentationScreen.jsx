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
            title: `Finding letters...`
        }

        this.propsForThresholdSlider = {
            maxValue: 200,
            minValue: 0,
            defaultValue: 100,
            iconName: 'fas fa-adjust',
            label: 'Threshold',
            unit: '',
            step: 1
        }

        this.propsForDilationCheckbox = {
            defaultValue: false,
            label: `Dilation + Erosion`,
            toolTipText: 'daw'
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
            onChangeDilation,
            onChangeThreshold
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
                                maxValue={this.propsForThresholdSlider.maxValue} 
                                minValue={this.propsForThresholdSlider.minValue}
                                defaultValue={this.propsForThresholdSlider.defaultValue} 
                                iconName={this.propsForThresholdSlider.iconName} 
                                label={this.propsForThresholdSlider.label} 
                                unit={this.propsForThresholdSlider.unit}
                                step={this.propsForThresholdSlider.step} 
                                onChange={onChangeThreshold} />
                        </div>
                        <div className="checkbox-control">
                            <CheckboxControl
                                defaultValue={this.propsForDilationCheckbox.defaultValue}
                                label={this.propsForDilationCheckbox.label}
                                tooltipText={this.propsForDilationCheckbox.toolTipText}
                                onChange={onChangeDilation} />
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
    onChangeThreshold: PropTypes.func.isRequired,
}

export default SegmentationScreen;