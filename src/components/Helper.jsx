import React, { Component } from "react";
import SliderControl from "./SliderControl";
import CheckboxControl from "./CheckboxControl";

export default class Helper extends Component {
  state = {};

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onCbChange = this.onCbChange.bind(this);

    this.state = {
      b: false
    };
  }

  onChange(value) {
    console.log(value);
  }

  onCbChange() {
    const b = !this.state.b;
    this.setState({ b });
    console.log(b);
  }

  render() {
    return (
      <React.Fragment>
        <SliderControl
          iconName="fas fa-american-sign-language-interpreting"
          onChange={this.onChange}
          label="label"
          unit="%"
          minValue={0}
          maxValue={100}
          step={1}
        />
        <CheckboxControl
          onChange={this.onCbChange}
          label="Checkbox"
          tooltipText="Tooltip"
        />
      </React.Fragment>
    );
  }
}
