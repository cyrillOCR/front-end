import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageAdjustmentScreen from './ImageAdjustmentScreen';
import ImageUploadScreen from './ImageUploadScreen';
import '../styles/AppLayout.css';
import SegmentationScreen from './SegmentationScreen';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import TextRecognitionScreen from './TextRecognitionScreen';
import Async from 'react-async';

const LoadingOverlay = () => <div className="loading-overlay">Loading...</div>;

export default class AppLayout extends Component {
    constructor(props) {
        super(props);
        this.newImageData = {};
        this.state = {
            loading: false
        };
    }

    onPageAdjustmentSubmit(currentPage, history, newData) {
        this.newImageData[currentPage - 1] = newData;
        history.push(`/${currentPage}/segmentation`);
    }

    getAdjustedPage(currentPage) {
        return this.newImageData[currentPage - 1] || this.imageURIs[currentPage - 1];
    }

    get imageUploadCallback() {
        return this.props.imageUploadCallback || (files =>
            Promise.resolve(files.map(URL.createObjectURL)));
    }

    currentPage(match) {
        return +match.params.page;
    }

    get totalPages() {
        return this.imageURIs.length;
    }

    shouldStop(history, match) {
        const page = this.currentPage(match);

        if (!this.imageURIs || this.imageURIs.length < 1) {
            history.push("/");
            return true;
        } else if (!this.imageURIs[page - 1]) {
            history.push("/1/adjust");
            return true;
        } else {
            return false;
        }
    }

    renderImageUploadScreen({ history }) {
        this.newImageData = {};
        return <ImageUploadScreen
            callback={(files) => {
                this.setState({loading: true});
                this.imageUploadCallback(files).then(uris => {
                    this.imageURIs = uris;
                    this.setState({loading: false});
                    history.push("/1/adjust");
                });
            }} />;
    }

    renderImageAdjustmentScreen({ history, match }) {
        const page = this.currentPage(match);

        if (this.shouldStop(history, match)) {
            return null;
        }

        return <ImageAdjustmentScreen
            key={page}
            imageURI={this.imageURIs[page - 1]}
            onPageChange={page => history.push(`/${page}/adjust`)}
            currentPage={page}
            totalPages={this.totalPages}
            onSubmit={this.onPageAdjustmentSubmit.bind(this, page, history)}
            onCancel={() => {
                if (page === 1) {
                    history.push("/");
                } else {
                    history.push(`/${page - 1}/recognition`);
                }
            }} />;
    }

    renderSegmentationScreen({ history, match }) {
        const page = this.currentPage(match);

        if (this.shouldStop(history, match)) {
            return null;
        }

        return <Async
            promiseFn={this.props.segmentationCallback}
            imageURI={this.getAdjustedPage(page)}
            contrastFactor={this.state.contrastFactor || 1.5}
            applyDilation={this.state.applyDilation || false}
            applyNoiseReduction={this.state.applyNoiseReduction || false}
            segmentationFactor={this.state.segmentationFactor || 0.5}
            separationFactor={this.state.separationFactor || 3}
            watch={JSON.stringify([
                page,
                this.state.contrastFactor,
                this.state.applyDilation,
                this.state.applyNoiseReduction,
                this.state.segmentationFactor,
                this.state.separationFactor
            ])}>
            <Async.Loading><LoadingOverlay /></Async.Loading>
            <Async.Resolved persist>
                {data => <SegmentationScreen
                    imageURI={data.payload}
                    onChangePage={page => history.push(`/${page}/segmentation`)}
                    currentPage={page}
                    totalPages={this.totalPages}
                    onChangeContrastFactor={contrastFactor => this.setState({ contrastFactor })}
                    onChangeApplyDilation={applyDilation => this.setState({ applyDilation })}
                    onChangeApplyNoiseReduction={applyNoiseReduction => this.setState({ applyNoiseReduction })}
                    onChangeSegmentationFactor={segmentationFactor => this.setState({ segmentationFactor })}
                    onChangeSeparationFactor={separationFactor => this.setState({ separationFactor })}
                    boxes={data.coords}
                    handlePrimary={() => history.push(`/${page}/recognition`)}
                    handleAuxiliary={() => history.push(`/${page}/adjust`)} />}
            </Async.Resolved>
            <Async.Rejected>
                {err => {
                    console.log(err);
                    return <div>Error. check console.</div>
                }}
            </Async.Rejected>
        </Async>;
    }

    renderRecognitionScreen({ history, match }) {
        const page = this.currentPage(match);

        if (this.shouldStop(history, match)) {
            return null;
        }

        return <Async
            promiseFn={this.props.recognitionCallback}
            imageURI={this.getAdjustedPage(page)}
            segmentationThreshold={this.state.segmentationThreshold}
            segmentationDaw={this.state.segmentationDaw}
            watch={JSON.stringify([page, this.state.segmentationThreshold, this.state.segmentationDaw])}>
            <Async.Loading><LoadingOverlay /></Async.Loading>
            <Async.Resolved>
                {data => <TextRecognitionScreen
                    imageURI={this.getAdjustedPage(page)}
                    onChangePage={page => history.push(`/${page}/recognition`)}
                    currentPage={page}
                    totalPages={this.totalPages}
                    boxes={data.boxes || []}
                    textAreaContent={data.text}
                    handlePrimary={() => history.push(`/${page}/segmentation`)}
                    handleSecondary={() => history.push(`/${page}/adjust`)}
                    handleAuxiliary={() => history.push("/")} />}
            </Async.Resolved>
        </Async>;
    }

    render() {
        return <Router>
            <React.Fragment>
                <Route exact path="/" render={this.renderImageUploadScreen.bind(this)} />
                <Route path="/:page/adjust" render={this.renderImageAdjustmentScreen.bind(this)} />
                <Route path="/:page/segmentation" render={this.renderSegmentationScreen.bind(this)} />
                <Route path="/:page/recognition" render={this.renderRecognitionScreen.bind(this)} />

                {(this.props.loading || this.state.loading) &&
                    <LoadingOverlay />}
            </React.Fragment>
        </Router>;
    }
}

AppLayout.propTypes = {
    loading: PropTypes.bool,
    imageUploadCallback: PropTypes.func,
    segmentationCallback: PropTypes.func.isRequired,
    recognitionCallback: PropTypes.func.isRequired
};
