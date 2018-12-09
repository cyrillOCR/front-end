import React, { Component } from "react";
import PropTypes from "prop-types";
import ResizeObserver from "react-resize-observer";
import { ReactSVGPanZoom, TOOL_PAN } from "react-svg-pan-zoom";

export default class ImagePreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            imageWidth: 0,
            imageHeight: 0,
            imageLoaded: false
        };
        this.containerRef = React.createRef();
        this.viewerRef = React.createRef();
        this.doFirstFit = true;
    }

    componentDidMount() {
        this.handleResize();
    }

    componentDidUpdate() {
        if (this.doFirstFit && this.viewerRef.current) {
            this.fitImage();
            this.doFirstFit = false;
        }
    }

    imageLoaded(e) {
        this.setState({
            imageWidth: e.target.naturalWidth,
            imageHeight: e.target.naturalHeight,
            imageLoaded: true
        });
    }

    fitImage() {
        this.viewerRef.current.fitToViewer("center", "center");
    }

    handleResize() {
        if (!this.containerRef.current) {
            return;
        }

        this.setState({
            width: this.containerRef.current.clientWidth,
            height: this.containerRef.current.clientHeight
        });
    }

    render() {
        const rects = this.state.imageLoaded
            ? this.props.boxes.map((coords, index) =>
                <rect key={index}
                    x={coords[0] * this.state.imageWidth}
                    y={coords[1] * this.state.imageHeight}
                    width={coords[2] * this.state.imageWidth}
                    height={coords[3] * this.state.imageHeight}
                    style={{
                        fill: "none",
                        stroke: "blue",
                        strokeOpacity: 0.5,
                        strokeWidth: 2
                    }}></rect>)
            : [];

        return <div ref={this.containerRef} style={{width: "100%", height: "100%"}}>
            {this.state.imageLoaded && this.state.width && this.state.height
                ? <ReactSVGPanZoom ref={this.viewerRef} background="none"
                    width={this.state.width} height={this.state.height}
                    tool={TOOL_PAN} toolbarPosition="none" scaleFactorOnWheel={1.04}>
                    <svg width={this.state.imageWidth} height={this.state.imageHeight}>
                        <image width={this.state.imageWidth} height={this.state.imageHeight}
                            xlinkHref={this.props.imageURI}></image>
                        {rects}
                    </svg>
                </ReactSVGPanZoom>
                : <img src={this.props.imageURI} onLoad={this.imageLoaded.bind(this)}
                    alt="Loading..." style={{display: "none"}} />
            }
            <ResizeObserver onResize={this.handleResize.bind(this)}></ResizeObserver>
        </div>;
    }
}

ImagePreview.propTypes = {
    imageURI: PropTypes.string.isRequired,
    boxes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
};
