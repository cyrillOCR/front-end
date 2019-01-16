import React, { Component } from "react";
import PropTypes from "prop-types";
import "../styles/TextRecognitionScreen.css";
import ImagePreview from "../components/ImagePreview";
import Sidekick from "./Sidekick";
import ButtonsControl from "./ButtonsControl";
import TextArea from "./TextArea";

export default class TextRecognitionScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wordIndex: -1
        };

        this.propsForSidekick = {
            title: "Recognize text"
        };

        this.propsForButtonsControl = {
            primaryLabel: "Back",
            secondaryLabel: "Adjust image",
            auxiliaryLabel: "Upload other image",
            iconLabel: "fas fa-undo-alt"
        };
    }

    render() {
        const {
            imageURI,
            boxes,
            currentPage,
            totalPages,
            handlePrimary,
            handleSecondary,
            handleAuxiliary,
            onChangePage
        } = this.props;

        let coordsList = boxes;
        if (this.state.wordIndex !== -1) {
            coordsList = coordsList.slice(0, this.state.wordIndex)
                        .concat([boxes[this.state.wordIndex].concat(10)])
                        .concat(coordsList.slice(this.state.wordIndex+1))
        }
        return (
            <div className="container">
                <div className="content-wrapper">
                    <div className="left-column">
                        {imageURI && (
                            <ImagePreview
                                imageURI={imageURI} boxes={coordsList}
                                onHighlight={(wordIndex) => this.setState({ wordIndex })}
                                onRemoveHighlight={() => this.setState({ wordIndex: -1 })}
                            />
                        )}
                    </div>
                    <div className="right-column">
                        <Sidekick
                            title={this.propsForSidekick.title}
                            onChange={onChangePage}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        >
                            <TextArea
                                text={this.props.textAreaContent}
                                highlighted={this.state.wordIndex}
                                onHighlight={(wordIndex) => this.setState({ wordIndex })}
                                onRemoveHighlight={() => this.setState({ wordIndex: -1 })}
                            />

                            <div className="buttons-control">
                                <ButtonsControl
                                    handlePrimary={handlePrimary}
                                    handleSecondary={handleSecondary}
                                    handleAuxiliary={handleAuxiliary}
                                    {...this.propsForButtonsControl}
                                />
                            </div>
                        </Sidekick>
                    </div>
                </div>
            </div>
        );
    }
}

TextRecognitionScreen.propTypes = {
    imageURI: PropTypes.string.isRequired,
    boxes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    handlePrimary: PropTypes.func.isRequired,
    handleSecondary: PropTypes.func.isRequired,
    handleAuxiliary: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    textAreaContent: PropTypes.arrayOf(PropTypes.string).isRequired
};
