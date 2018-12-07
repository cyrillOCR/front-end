import React, { Component } from 'react'
import ImageEditor from './ImageEditor'
import SliderControl from './SliderControl'

export default class Test extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onCropChange = this.onCropChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOffsetLeftChange = this.handleOffsetLeftChange.bind(this);
        this.state = {
            bounds: {
                top: 0,
                left: 0,
                width: 0,
                height: 0
            },
            limits: {
                top: 0,
                left: 0,
                width: 0,
                height: 0
            }
        }
        this.imageEditor = React.createRef();
    }
    onChange(e) {
        console.log(e.target.files)
        if (e.target.files && e.target.files.length > 0) {
            this.setState({ image: e.target.files[0] });
        }
    }

    onCropChange(newCrop) {
        newCrop.modify = true;
        this.setState(newCrop)
    }

    handleSubmit(e) {
        const img = this.imageEditor.current.getRectImage(this.state.bounds);
        this.setState({ crop: img });
    }

    handleOffsetLeftChange(value) {
        let newState = this.state;
        newState.bounds.left = parseInt(value, 10);
        this.setState(newState);
    }

    render() {
        return (
            <div>
                {
                    this.state.image &&
                    <div>
                        <div style={{ display: "flex" }}>
                            <ImageEditor
                                ref={this.imageEditor}
                                imageData={URL.createObjectURL(this.state.image)}
                                onChange={this.onCropChange}
                                top={this.state.bounds.top}
                                left={this.state.bounds.left}
                                width={this.state.bounds.width}
                                height={this.state.bounds.height}
                            />
                            {
                                this.state.crop &&

                                <div>
                                    <img style={{ height: "auto" }} src={this.state.crop} alt="" />
                                </div>
                            }
                        </div>
                        {
                            this.state.modify &&
                            <SliderControl
                                iconName="cog"
                                onChange={this.handleOffsetLeftChange}
                                label="Offset left"
                                minValue={0}
                                maxValue={this.state.limits.left}
                                defaultValue={this.state.bounds.left}
                                step={1}
                            />
                        }

                        <button
                            onClick={this.handleSubmit}>
                            Clika</button>

                    </div>
                }
                {
                    !this.state.image &&
                    <input
                        type="file"
                        onChange={this.onChange} />
                }
            </div>
        )
    }
}
