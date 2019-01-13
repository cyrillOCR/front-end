import React from 'react';
import PropTypes from 'prop-types'

import '../styles/LoadingOverlay.css';

// const coolStatements = [
//   'Dusting of paper',
//   'Oldie but goldie',
//   'Please consider the environment before printing this Slack',
//   'More "holy moly!"',
//   `We're all in this together`
// ]

export default class LoadingOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indexText: 0
        }
    }
    render() {
        const { loadingStatements }  = this.props;

        setTimeout(()=>{
            this.setState({indexText: Math.floor(Math.random() * loadingStatements.length) })
        }, 4000)

        if (!loadingStatements) {
            return '...';
        }
        else {
            return(
                <div className="main">
                    <div className="animation">
                        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                    </div>
                    <div className="loading-statements-container">
                        <div className="text-container">
                            {loadingStatements[this.state.indexText]}
                        </div>
                    </div>
                </div>
            )        
        }
    }
}

LoadingOverlay.propTypes = {
    loadingStatements: PropTypes.arrayOf(PropTypes.string).isRequired
}