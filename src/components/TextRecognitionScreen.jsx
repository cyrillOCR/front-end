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

        return (
            <div className="text-recognition-screen-container">
                <div className="image-preview-container">
                    {imageURI && (
                        <ImagePreview imageURI={imageURI} boxes={boxes} />
                    )}
                </div>
                <div className="sidekick-container-parent">
                    <Sidekick
                        title={this.propsForSidekick.title}
                        onChange={onChangePage}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    >
                        <TextArea text={this.props.textAreaContent} />

                        <div className="buttons-control">
                            <ButtonsControl
                                handlePrimary={handlePrimary}
                                handleSecondary={handleSecondary}
                                handleAuxiliary={handleAuxiliary}
                                primaryLabel={
                                    this.propsForButtonsControl.primaryLabel
                                }
                                secondaryLabel={
                                    this.propsForButtonsControl.secondaryLabel
                                }
                                auxiliaryLabel={
                                    this.propsForButtonsControl.auxiliaryLabel
                                }
                                iconLabel={
                                    this.propsForButtonsControl.iconLabel
                                }
                            />
                        </div>
                    </Sidekick>
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
    textAreaContent: PropTypes.string
};
