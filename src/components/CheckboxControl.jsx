import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import "../styles/CheckboxControl.css";

export default class CheckboxControl extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            checked:
                props.defaultValue === undefined ? false : props.defaultValue
        };
    }

    handleChange(e) {
        const checked = !this.state.checked;
        this.setState({ checked });
        this.props.onChange(checked);
    }

    render() {
        var checkboxIcon;
        if (this.state.checked) checkboxIcon = "fas fa-check-square";
        else checkboxIcon = "fas fa-square";

        return (
            <div className="checkbox-control-container">
                <div className="checkbox-container">
                    <FontAwesome
                        className="checkbox-icon"
                        name={checkboxIcon}
                        onClick={this.handleChange}
                    />
                    <span className="label-text">{this.props.label}</span>
                    {this.props.tooltipText && (
                        <React.Fragment>
                            <FontAwesome
                                className="tooltip-icon"
                                name="fas fa-info-circle"
                            />
                            <span className="tooltip-text">
                                {this.props.tooltipText}
                            </span>
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}

CheckboxControl.propTypes = {
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    defaultValue: PropTypes.bool,
    tooltipText: PropTypes.string
};
