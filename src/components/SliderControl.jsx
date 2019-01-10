import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import "../styles/SliderControl.css";

export default class SliderControl extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleReset = this.handleReset.bind(this);
        let defaultValue = this.props.defaultValue;

        if (!defaultValue)
            defaultValue = (this.props.maxValue + this.props.minValue) / 2;

        this.state = {
            value: defaultValue
        };
    }

    handleReset() {
        this.setState({ value: this.props.defaultValue });
        this.props.onChange(this.props.defaultValue);
    }

    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });

        //call the callback on every step if 'onMouseUp' event is not specified
        if (!this.props.update || this.props.update === 'all')
            this.props.onChange(value);
    }

    handleValueUpdate(e){
        const value = e.target.value;
        this.props.onChange(value);
    }

    render() {
        let onMouseUpProp = {}; // prop for range input
        let onBlurProp = {}; // prop for value input
        if (this.props.update === 'final')
            onMouseUpProp['onMouseUp'] = this.handleValueUpdate.bind(this);
            onBlurProp['onBlur'] = this.handleValueUpdate.bind(this);

        return (
            <div className="slider-control-container">
                <div className="label-container">
                    <span className="label-icon">
                        <FontAwesome name={this.props.iconName} />
                    </span>
                    <span className="label-text">{this.props.label}:</span>
                    <span className="value-input">
                        <input
                            type="text"
                            value={this.state.value}
                            onChange={this.handleChange}
                            style={{
                                width: (String(parseFloat(this.state.value)).length+2) * .4 + 'rem'
                            }}
                            {...onBlurProp}
                        />
                    </span>
                    {this.props.unit && (
                        <span className="unit">{this.props.unit}</span>
                    )}
                    {this.props.defaultValue !== this.state.value && (
                        <span
                            className="reset-button"
                            onClick={this.handleReset}
                        >
                            Reset
                        </span>
                    )}
                </div>
                <div className="range-container">
                    <input
                        type="range"
                        min={this.props.minValue}
                        max={this.props.maxValue}
                        value={this.state.value}
                        onChange={this.handleChange}
                        step={this.props.step}
                        {...onMouseUpProp}
                    />
                </div>
            </div>
        );
    }
}

SliderControl.propTypes = {
    iconName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    unit: PropTypes.string,
    minValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    defaultValue: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    update: PropTypes.oneOf(['all', 'final'])
};
