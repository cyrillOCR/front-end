import React from 'react';
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

const ButtonContainer = ({handleClick, label, icon, className}) =>(
    <button className={className} onClick={handleClick}>
        {icon &&
            <FontAwesome className="button-icon" name={icon} />
        }
        {label}
    </button>
);

ButtonContainer.propTypes = {
    handleClick:PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    className: PropTypes.string
}

export default ButtonContainer;