import React, { Component } from 'react'
import ImageEditor from './ImageEditor'
import SliderControl from './SliderControl'
import Sidekick from './Sidekick'
import TextArea from './TextArea'

export default class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bounds: {
                top: .25,
                left: .25,
                width: .5,
                height: .5
            }
        }
        this.imageEditor = React.createRef();
    }

    onCropChange(newCrop) {
        newCrop.modify = true;
        this.setState(newCrop)
        console.log(this.state);
    }

    handleSubmit(e) {
        const img = this.imageEditor.current.getRectImage(this.state.bounds);
        this.setState({ crop: img });
    }

    handleOffsetLeftChange(value) {
        let newState = this.state;
        newState.bounds.left = parseFloat(value);
        this.setState(newState);
        this.imageEditor.current.updateRect(newState.bounds);
    }

    handleWidthChange(value){
        let newState = this.state;
        newState.bounds.width = parseFloat(value);
        this.setState(newState);
        this.imageEditor.current.updateRect(newState.bounds);
    }

    handleOffsetTopChange(value) {
        let newState = this.state;
        newState.bounds.top = parseFloat(value);
        this.setState(newState);
        this.imageEditor.current.updateRect(newState.bounds);
    }

    handleHeightChange(value){
        let newState = this.state;
        newState.bounds.height = parseFloat(value);
        this.setState(newState);
        this.imageEditor.current.updateRect(newState.bounds);
    }

    render() {
        return (
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                display: "flex",
                background: "#f6f6f6",
                padding: "2rem 1rem",
                width: "100%",
                height: "100%",
                margin: "0 auto",
            }}>
                <div style={{
                    flexGrow: 1,
                    padding: "1rem",
                    display: "flex"
                }}>
                    <div style={{
                        position: "relative",
                        flexGrow: 1
                    }}>
                        <ImageEditor
                            ref = {this.imageEditor}
                            imageURI="http://www.warrelics.eu/forum/attachments/documents-non-award-photographs-ids-posters-other-ephemera/37276d1241880837-russian-hand-writing-victory-over-germany-1946.jpg"
                            onChange={this.onCropChange.bind(this)}
                            top={this.state.bounds.top}
                            left={this.state.bounds.top}
                            width={this.state.bounds.width}
                            height={this.state.bounds.height}
                            onSubmit={this.handleSubmit.bind(this)}
                        />
                    </div>
                </div>
                <div style={{
                    flexGrow: 1,
                    padding: "1rem"
                }}> 
                {
                    this.state.limits &&
                    <Sidekick title="Title">
                        <SliderControl
                            label="X-pos"
                            iconName="cog"
                            minValue={0}
                            maxValue={this.state.limits.left}
                            step={0.01}
                            onChange={this.handleOffsetLeftChange.bind(this)}
                        />
                        <SliderControl
                            label="Y-pos"
                            iconName="cog"
                            minValue={0}
                            maxValue={this.state.limits.top}
                            step={0.01}
                            onChange={this.handleOffsetTopChange.bind(this)}
                        />
                        <SliderControl
                            label="Width"
                            iconName="cog"
                            minValue={0}
                            maxValue={this.state.limits.width}
                            step={0.01}
                            onChange={this.handleWidthChange.bind(this)}
                        />
                        <SliderControl
                            label="Height"
                            iconName="cog"
                            minValue={0}
                            maxValue={this.state.limits.height}
                            step={0.01}
                            onChange={this.handleHeightChange.bind(this)}
                        />
                    </Sidekick>
                }
                </div>
            </div>
        )
    }
}
