import React, { Component } from 'react'
import ImageAdjustmentScreen from './ImageAdjustmentScreen'

export default class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1
        }


    }

    handleSubmit(returnValue) {
        console.log(returnValue)
        this.setState({ result: returnValue })
    }

    handleCancel() {
        console.log("cancel")
        this.setState({ cancel: true })
    }

    handlePageChange(page) {
        this.setState({ currentPage: page })
    }

    onImageUpload(e) {
        console.log(e)
        this.setState({
            image: URL.createObjectURL(e.target.files[0])
        })
    }

    render() {
        const propsToPass = {
            imageURI: this.state.image,
            onSubmit: this.handleSubmit.bind(this),
            onCancel: this.handleCancel.bind(this),
            onPageChange: this.handlePageChange.bind(this),
            currentPage: this.state.currentPage,
            totalPages: 10
        }
        return (
            <div>
                {
                    this.state.image && !(this.state.result || this.state.cancel) &&
                    <ImageAdjustmentScreen
                        {...propsToPass}
                    />
                }
                {
                    this.state.result &&
                    <img src={this.state.result} alt="" />
                }
                {
                    this.state.cancel &&
                    <h3>Canceled</h3>
                }
                {
                    !this.state.image &&
                    <input
                        type="file"
                        ref={(ref) => this.fileUploadInput = ref}
                        onChange={this.onImageUpload.bind(this)}
                    />
                }

            </div>
        )
    }
}
