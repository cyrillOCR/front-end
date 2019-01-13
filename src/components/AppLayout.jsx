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
            loading: false,
            prevScreen: '',
            currentScreen: ''
        };
    }

    onPageAdjustmentSubmit(currentPage, history, newData) {
        this.props.updateAdjustedImage(currentPage, newData);
        this.setActivePage(currentPage, history, 'segmentation')
    }

    getAdjustedPage(currentPage) {
        const data = this.props.data[currentPage] || {};
        return data.adjusted || data.original;
    }

    setActivePage(page, history, screen) {
        if (screen === '') {
            history.push('/');
            page = 1;
        }
        else history.push(`/${page}/${screen}`);
        console.log(page, history, screen);
        this.setState({ page, prevScreen: this.state.currentScreen, currentScreen: screen });
    }

    get imageUploadCallback() {
        return this.props.imageUploadCallback || (files =>
            Promise.resolve(files.map(URL.createObjectURL)));
    }

    currentPage(match) {
        return +match.params.page;
    }

    get totalPages() {
        return Object.keys(this.props.data).length;
    }

    shouldStop(history, match) {
        const page = this.currentPage(match);
        if (!this.props.data[page] || this.props.data[page].length < 1) {
            this.setActivePage(1, history, '');
            return true;
        } else if (!this.props.data[page]) {
            this.setActivePage(1, history, this.state.currentScreen);
            return true;
        } else {
            return false;
        }
    }

    renderImageUploadScreen({ history }) {
        return <ImageUploadScreen
            callback={(files) => {
                this.setState({ loading: true });
                this.imageUploadCallback(files).then(uris => {
                    for (let { file, i } of uris.map((file, i) => { return { file, i } }))
                        this.props.updateOriginalImage(i + 1, file);
                    this.setState({ loading: false });
                    history.push('/1/adjust');
                    this.setActivePage(1, history, 'adjust');
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
            imageURI={this.props.data[page].original}
            onPageChange={page => this.setActivePage(page, history, 'adjust')}
            currentPage={page}
            totalPages={this.totalPages}
            onSubmit={this.onPageAdjustmentSubmit.bind(this, page, history)}
            onCancel={() => {
                if (this.props.data[page].adjusted) this.setActivePage(page, history, 'segmentation');
                else this.setActivePage(page, history, '');
            }} />;
    }

    renderSegmentationScreen({ history, match }) {
        const page = this.currentPage(match);
        const cfg = (this.props.data[page] || {}).configValues || {};

        if (this.shouldStop(history, match)) {
            return null;
        }

        return <Async
            promiseFn={this.props.segmentationCallback}
            page={page}
            imageURI={this.getAdjustedPage(page)}
            contrastFactor={cfg.contrastFactor || 1.5}
            applyDilation={cfg.applyDilation || false}
            applyNoiseReduction={cfg.applyNoiseReduction || false}
            segmentationFactor={cfg.segmentationFactor || 0.5}
            separationFactor={cfg.separationFactor || 3}
            watch={JSON.stringify([
                page, cfg.contrastFactor, cfg.applyDilation, cfg.applyNoiseReduction, cfg.segmentationFactor, cfg.separationFactor
            ])}>
            <Async.Loading><LoadingOverlay /></Async.Loading>
            <Async.Resolved persist>
                {data => <SegmentationScreen
                    imageURI={data.payload}
                    onChangePage={page => {
                        if (this.props.data[page].adjusted) this.setActivePage(page, history, 'segmentation')
                        else this.setActivePage(page, history, 'adjust')
                    }}
                    currentPage={page}
                    totalPages={this.totalPages}
                    onChangeContrastFactor={value => this.props.updateConfigValue(page, 'contrastFactor', value)}
                    onChangeApplyDilation={value => this.props.updateConfigValue(page, 'applyDilation', value)}
                    onChangeApplyNoiseReduction={value => this.props.updateConfigValue(page, 'applyNoiseReduction', value)}
                    onChangeSegmentationFactor={value => this.props.updateConfigValue(page, 'segmentationFactor', value)}
                    onChangeSeparationFactor={value => this.props.updateConfigValue(page, 'separationFactor', value)}
                    boxes={data.coords}
                    handlePrimary={() => this.setActivePage(page, history, 'recognition')}
                    handleAuxiliary={() => this.setActivePage(page, history, 'adjust')} 
                    defaultValues={this.props.data[page].configValues || {}}
                    />}
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
    recognitionCallback: PropTypes.func.isRequired,
    updateOriginalImage: PropTypes.func.isRequired,
    updateAdjustedImage: PropTypes.func.isRequired,
    updateConfigValue: PropTypes.func.isRequired,
    updateRecognizedText: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};
