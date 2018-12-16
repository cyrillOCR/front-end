import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import '../styles/SliderControl.css'

export default class SliderControl extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        let defaultValue = this.props.defaultValue;
        
        if(!defaultValue)
            defaultValue = (this.props.maxValue + this.props.minValue) / 2;
        
        this.state = {
            value: defaultValue
        };
    }

    handleChange(e){
        const value = e.target.value;
        this.setState({value})
        this.props.onChange(value);
    }
	render() {

		return (
			<div className="slider-control-container">
				<div className="label-container">
                    <span className="label-icon">
                        <FontAwesome name={this.props.iconName} /> 
                    </span>
                    <span className="label-text">
                        {this.props.label}:
                    </span>
                    <span className="value-input">
                        <input
                            type="text"
                            value={this.state.value}
                            onChange={this.handleChange}
                            style={{
                                width: (String(parseInt(this.props.maxValue, 10)).length+2) * .7 + 'rem'
                            }}
                        />
                    </span>
                    {this.props.unit && (
                        <span className="unit">{this.props.unit}</span>
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
                    />
                </div>
			</div>
		)
    }
    
}

SliderControl.propTypes = {
    iconName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    unit: PropTypes.string,
    minValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    defaultValue: PropTypes.number,
    step: PropTypes.number.isRequired
}