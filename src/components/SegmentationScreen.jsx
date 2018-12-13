import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../styles/SegmentationScreen.css';
import ImagePreview from '../components/ImagePreview';
import Sidekick from './Sidekick';
import SliderControl from './SliderControl';
import CheckboxControl from './CheckboxControl';
import ButtonsControl from './ButtonsControl';

var boxes = [
    [0.045,0.087,0.065,0.029],
    // [0.13,0.087,0.029,0.029],
    // [0.046,0.192,0.0490,0.029],
    // [0.126,0.192,0.113,0.029],
    // [0.27,0.192,0.066,0.029],
    // [0.353,0.192,0.045,0.029],
    // [0.419,0.192,0.01,0.029],
    // [0.450,0.192,0.095,0.029],
    // [0.593,0.192,0.113,0.029]
];

class SegmentationScreen extends Component {

    constructor(props) {
        super(props);

        this.propsForSidekick = {
            title: `Finding letters...`,
            currentPage: 1,
            totalPages: 1
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

        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeThreshold = this.onChangeThreshold.bind(this);
        this.onChangeDilation = this.onChangeDilation.bind(this);
        this.handlePrimary = this.handlePrimary.bind(this);
        this.handleSecondary = this.handleSecondary.bind(this);
        this.handleAuxiliary = this.handleAuxiliary.bind(this);
    }


    onChangeThreshold(threshold) {
        console.log('threshold', threshold);
        
    }

    onChangeDilation(checked) {
        console.log('checked', checked);
    }

    handlePrimary() {
        console.log('handlePrimary');
    }

    handleSecondary() {
        console.log('handleSecondary');
    }
    handleAuxiliary() {
        console.log('handleAuxiliary');
    }

    onChangePage() {
        console.log('onChangePage');
    }

    render() {
        // var imagePreview = <ImagePreview 
        //                     imageURI={`https://www.scriptreaderpro.com/wp-content/uploads/2018/09/Screen-Shot-2018-09-17-at-2.40.21-PM-1024x807.png`}
        //                     boxes={boxes}/>


        var imagePreview = <ImagePreview 
                            imageURI={`https://sites.ualberta.ca/~lmalcolm/poetry/Bely4.gif`}
                            boxes={boxes}/>
 
        return (    
            <div className="segmentation-screen-container">
                <div className="image-preview-container">
                    {imagePreview}
                </div>
                <div className="sidekick-container-parent">
                    <Sidekick 
                        title={this.propsForSidekick.title} 
                        onChange={this.onChangePage} 
                        currentPage={this.propsForSidekick.currentPage} 
                        totalPages={this.propsForSidekick.totalPages}>
                        <div className="slider-control">
                            <SliderControl
                                maxValue={this.propsForThresholdSlider.maxValue} 
                                minValue={this.propsForThresholdSlider.minValue}
                                defaultValue={this.propsForThresholdSlider.defaultValue} 
                                iconName={this.propsForThresholdSlider.iconName} 
                                label={this.propsForThresholdSlider.label} 
                                unit={this.propsForThresholdSlider.unit}
                                step={this.propsForThresholdSlider.step} 
                                onChange={this.onChangeThreshold} />
                        </div>
                        <div className="checkbox-control">
                            <CheckboxControl
                                defaultValue={this.propsForDilationCheckbox.defaultValue}
                                label={this.propsForDilationCheckbox.label}
                                tooltipText={this.propsForDilationCheckbox.toolTipText}
                                onChange={this.onChangeDilation} />
                        </div>
                        
                        <div className="buttons-control">
                            <ButtonsControl
                                handlePrimary={this.handlePrimary}
                                handleSecondary={this.handleSecondary}
                                handleAuxiliary={this.handleAuxiliary}
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

export default SegmentationScreen;