import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import "../styles/CheckboxControl.css";

export default class CheckboxControl extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      checked: false
    };
  }

  handleChange(e) {
    const checked = !this.state.checked;
    this.setState({ checked });
    this.props.onChange();
  }

  render() {
    var checkboxIcon;
    if (this.state.checked) checkboxIcon = "fas fa-check-square";
    else checkboxIcon = "fas fa-square";

    var tooltip;
    if (this.props.hasTooltip)
      tooltip = (
        <React.Fragment>
          <FontAwesome className="tooltip-icon" name="fas fa-info-circle" />
          <span className="tooltip-text">{this.props.tooltipText}</span>
        </React.Fragment>
      );

    return (
      <div className="checkbox-control-container">
        <div className="checkbox-container">
          <FontAwesome
            className="checkbox-icon"
            name={checkboxIcon}
            onClick={this.handleChange}
          />
          <span className="label-text">{this.props.label}</span>
          {tooltip}
        </div>
      </div>
    );
  }
}

CheckboxControl.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  hasTooltip: PropTypes.bool.isRequired,
  tooltipText: function(props, propName, componentName) {
    if (
      props["hasTooltip"] === true &&
      (props[propName] === undefined || typeof props[propName] !== "string")
    ) {
      return new Error("Please provide tooltip content!");
    }
  }
};
