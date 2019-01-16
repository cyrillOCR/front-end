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
            indexText: Math.floor(Math.random() * this.props.loadingStatements.length)
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            const stmtsLength = this.props.loadingStatements.length;
            let newIndex = Math.floor(Math.random() * stmtsLength);
            while (newIndex === this.state.indexText)
                newIndex = Math.floor(Math.random() * stmtsLength);
            this.setState({ indexText: newIndex })
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className="main">
                <div className="animation">
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
                <div className="loading-statements-container">
                    <div className="text-container">
                        {this.props.loadingStatements[this.state.indexText]}
                    </div>
                </div>
            </div>
        )
    }
}

LoadingOverlay.propTypes = {
    loadingStatements: PropTypes.arrayOf(PropTypes.string).isRequired
}