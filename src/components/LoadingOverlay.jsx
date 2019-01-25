import React from 'react';

import '../styles/LoadingOverlay.css';

export default class LoadingOverlay extends React.Component {
    constructor(props) {
        super(props);

        this.loadingMessages = [
            'Dusting off the paper',
            'Polishing the letters',
            'Searching for courses in cyrillic',
            'Learning to read ugly writing',
            'We are all in this together',
            'A poor student is trying to figure it out',
            'Hold tight now',
            'Wait for it',
            'Any moment now',
            'Blame it on the system',
            'Patience is the greatest virtue',
            'Putin’ the letters in the right order',
            'Backtracking on all possible results',
            'Waiting for our translator to finish his coffee',
            'Brace yourself. Translation is coming',
            'Recharging server\'s batteries',
            'Stressing Google translate',
            'Wait while we pray for this to work',
            'Watering our translator',
            'Doing our best to guess those letters',
            'Photoshopping those ugly pages',
            'Oldie but goldie'
        ]

        const index = Math.floor(Math.random() * this.loadingMessages.length);
        const history = [index];

        this.state = {
            indexText: index,
            history: history
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            const stmtsLength = this.loadingMessages.length;
            let newIndex = Math.floor(Math.random() * stmtsLength);
            let history = this.state.history;
            while (history.indexOf(newIndex) !== -1)
                newIndex = Math.floor(Math.random() * stmtsLength);
            if (history.length >= 5) history = history.slice(1).concat(newIndex);
            else history = history.concat(newIndex);
            this.setState({ indexText: newIndex , history})
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
                        {this.loadingMessages[this.state.indexText]}
                    </div>
                </div>
            </div>
        )
    }
}