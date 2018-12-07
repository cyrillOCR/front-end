import React from 'react';
import '../styles/ButtonsControl.css'
import FontAwesome from 'react-fontawesome'
import PropTypes from 'prop-types'
import ButtonContainer from './ButtonContainer';

const ButtonsControl = ({handlePrimary , handleSecondary , handleAuxiliary , primaryLabel , secondaryLabel , auxiliaryLabel , iconLabel})=>(
        <div className="buttons-group">
            <ButtonContainer 
                label={primaryLabel} 
                icon={<FontAwesome className={iconLabel} name="back" />}
                handleClick={handlePrimary}
                className="primary-button"
            />
            <ButtonContainer 
                label={secondaryLabel}
                handleClick={handleSecondary}
                className="secondary-button"
            />
            <ButtonContainer 
                label={auxiliaryLabel} 
                handleClick={handleAuxiliary}
                className="auxiliary-button"
            />
        </div>
)

ButtonsControl.propTypes = {
    handlePrimary:PropTypes.func.isRequired,
    handleSecondary:PropTypes.func.isRequired,
    handleAuxiliary:PropTypes.func.isRequired,
    primaryLabel:PropTypes.string.isRequired,
    secondaryLabel:PropTypes.string.isRequired,
    auxiliaryLabel:PropTypes.string.isRequired,
    iconLabel:PropTypes.string.isRequired
}

export default ButtonsControl;
