import React, { Component } from 'react';
import '../styles/ButtonsControl.css'
import FontAwesome from 'react-fontawesome'

class ButtonsControl extends Component{
    
    render() {
        return (
        <div className="buttons-group">
            <button className="primaryButton">
            <span><FontAwesome className="fas fa-undo-alt"/></span>{this.props.primaryButton}</button>
            <button className="secondaryButton">{this.props.secondaryButton}</button>
            <button className="auxiliaryButton">{this.props.auxiliaryButton}</button>
        </div>)
    }
}

export default ButtonsControl;