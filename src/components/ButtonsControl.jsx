import React from 'react';
import '../styles/ButtonsControl.css'
import FontAwesome from 'react-fontawesome'
import PropTypes from 'prop-types'
import ButtonContainer from './ButtonContainer';

const ButtonsControl = ({handleBack, handleAdjust, handleUpload})=>(
        <div className="buttons-group">
            <ButtonContainer 
                label="Back" 
                icon={<FontAwesome className="fas fa-undo-alt icon-back" name="back" />}
                handleClick={handleBack}
                className="primary-button"
            />
            <ButtonContainer 
                label="Adjust image" 
                handleClick={handleAdjust}
                className="secondary-button"
            />
            <ButtonContainer 
                label="Upload other image" 
                handleClick={handleUpload}
                className="auxiliary-button"
            />
        </div>
)

ButtonsControl.propTypes = {
    handleBack:PropTypes.func.isRequired,
    handleAdjust:PropTypes.func.isRequired,
    handleUpload:PropTypes.func.isRequired,
}

export default ButtonsControl;