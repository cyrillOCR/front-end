import React from 'react';
import PropTypes from 'prop-types'

const ButtonContainer = ({handleClick, label, icon, className}) =>(
    <button className={className} onClick={handleClick}>
        {icon && icon}
        {label}
    </button>
);

ButtonContainer.propTypes = {
    handleClick:PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.element,
    className: PropTypes.string
}

export default ButtonContainer;