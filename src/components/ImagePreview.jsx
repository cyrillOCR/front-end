import React, { Component } from "react";
import PropTypes from "prop-types";
import "../styles/ImagePreview.css";
import { contain } from "intrinsic-scale";
import ResizeObserver from "react-resize-observer";

export default class ImagePreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overlayStyle: {
                display: "none"
            }
        };
        this.imageRef = React.createRef();
    }

    moveOverlay() {
        const img = this.imageRef.current;
        const info = contain(img.width, img.height, img.naturalWidth, img.naturalHeight);
        if (isNaN(info.x)) {
            return;
        }
        this.setState({
            overlayStyle: {
                right: 0,
                top: info.y,
                width: info.width,
                height: info.height,
                position: "absolute"
            }
        });
    }

    render() {
        const rects = this.props.boxes.map((coords, index) => (
            <div key={index} className="img-overlay-wrap-rect" style={{
                left: coords[0] * 100 + "%",
                top: coords[1] * 100 + "%",
                width: coords[2] * 100 + "%",
                height: coords[3] * 100 + "%",
            }}></div>
        ));

        return <div className="img-overlay">
            <div className="img-overlay-wrap">
                <img ref={this.imageRef} src={this.props.imageURI} onLoad={this.moveOverlay.bind(this)} />
                <div style={this.state.overlayStyle}>
                    <div style={{
                        position: "relative",
                        width: "100%",
                        height: "100%"
                    }}>{rects}</div>
                </div>
            </div>
            <ResizeObserver onResize={this.moveOverlay.bind(this)}></ResizeObserver>
        </div>;
    }
}

ImagePreview.propTypes = {
    imageURI: PropTypes.string.isRequired,
    boxes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
};
