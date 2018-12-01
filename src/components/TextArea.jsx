import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import '../styles/TextArea.css'


export default class TextArea extends Component {
    constructor(props) {
        super(props);
        this.textareaRef = React.createRef();
        this.copyButtonRef = React.createRef();

        this.handleCopy = this.handleCopy.bind(this);
    }

    emphasisButton(mode){
        let copyButton = this.copyButtonRef.current;
        copyButton.classList.add(mode);
        setTimeout(() => copyButton.classList.remove(mode), 2000);
    }

    handleCopy(e) {
        let textarea = this.textareaRef.current;
        textarea.focus();
        textarea.select();
        try{
            const result = document.execCommand('copy');
            if(result) this.emphasisButton('success');
            else this.emphasisButton('error');
        } catch(err){
            this.emphasisButton('error');
        }
    }

    render() {
        return (
            <div className="textarea-container">
                <button
                    onClick={this.handleCopy}
                    ref={this.copyButtonRef}
                    className="textarea-copy-button">
                    <FontAwesome name="copy" />
                </button>
                <textarea
                    ref={this.textareaRef}
                    onClick={(e) => e.target.select()}
                    value={this.props.text}
                    readOnly
                ></textarea>
            </div>
        )
    }
}
