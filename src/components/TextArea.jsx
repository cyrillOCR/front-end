import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import PropTypes from 'prop-types'
import '../styles/TextArea.css'


export default class TextArea extends Component {
    constructor(props) {
        super(props);
        this.textareaRef = React.createRef();
        this.copyButtonRef = React.createRef();

        this.handleCopy = this.handleCopy.bind(this);
    }

    emphasisButton(mode) {
        let copyButton = this.copyButtonRef.current;
        copyButton.classList.add(mode);
        setTimeout(() => copyButton.classList.remove(mode), 2000);
    }

    handleCopy(e) {
        let execCopy = () => {
            try {
                const result = document.execCommand('copy');
                if (result) this.emphasisButton('success');
                else this.emphasisButton('error');
            } catch (err) {
                this.emphasisButton('error');
            }
        }

        let textarea = this.textareaRef.current;
        if (document.body.createTextRange) {
            const range = document.body.createTextRange();
            range.moveToElementText(textarea);
            range.select();
            execCopy();
        } else if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(textarea);
            selection.removeAllRanges();
            selection.addRange(range);
            execCopy();
        } else {
            console.warn("Could not select text in node: Unsupported browser.");
        }
    }


    render() {
        let wordsList = this.props.text.map((word, i) =>
            (<React.Fragment key={i}>
                <span
                    onMouseEnter={() => this.props.onHighlight(i)}
                    onMouseLeave={this.props.onRemoveHighlight}
                    className={i === this.props.highlighted ? 'active' : ''}
                    >
                    {word}
                </span>
                {" "}
            </React.Fragment>)
        )

        return (
            <div className="textarea-container">
                <button
                    onClick={this.handleCopy}
                    ref={this.copyButtonRef}
                    className="textarea-copy-button">
                    <FontAwesome name="copy" />
                </button>
                <div className="textarea"
                    ref={this.textareaRef}
                >
                    {wordsList}
                </div>
            </div>
        )
    }
}

TextArea.propTypes = {
    text: PropTypes.arrayOf(PropTypes.string).isRequired,
    onHighlight: PropTypes.func.isRequired,
    onRemoveHighlight: PropTypes.func.isRequired
}