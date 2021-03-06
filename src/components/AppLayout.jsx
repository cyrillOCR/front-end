import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageAdjustmentScreen from './ImageAdjustmentScreen';
import ImageUploadScreen from './ImageUploadScreen';
import '../styles/AppLayout.css';
import SegmentationScreen from './SegmentationScreen';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import TextRecognitionScreen from './TextRecognitionScreen';
import Async from 'react-async';
import LoadingOverlay from './LoadingOverlay';
import ErrorHandler from './ErrorSnackbar';


export default class AppLayout extends Component {
    constructor(props) {
        super(props);
        this.newImageData = {};
        this.state = {
            data: {},
            loading: false,
            prevScreen: '',
            currentScreen: '',
            error: false
        };

    }

    onError(errorMsg) {
        this.setState({ error: true, errorMsg: errorMsg });
    }

    onErrorClose() {
        this.setState({ error: false, errorMsg: '' });
    }

    onPageAdjustmentSubmit(currentPage, history, newData) {
        this.props.updateAdjustedImage(currentPage, newData);
        this.setActivePage(currentPage, history, 'segmentation')
    }

    getAdjustedPage(currentPage) {
        const data = this.props.data[currentPage] || {};
        return data.adjusted || data.original;
    }

    getProcessedPage(currentPage) {
        const data = this.props.data[currentPage] || {};
        return data.processed || data.adjusted;
    }

    updateCfg(property, value) {
        let oldData = this.state.configValues || {};

        if (oldData[property] !== value) {
            oldData[property] = value;
            this.setState({ configValues: oldData });
        }
    }

    setActivePage(page, history, screen) {
        if (screen === '') {
            history.push('/');
            page = 1;
        }
        else history.push(`/${page}/${screen}`);
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
                    this.setActivePage(1, history, 'adjust');
                }).catch(error => {
                    this.setState({loading: false});
                    this.onError(error.message);
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
            onPageChange={page => {
                if (this.props.data[page].text) this.setActivePage(page, history, 'recognition');
                else if (this.props.data[page].processed) this.setActivePage(page, history, 'segmentation');
                else this.setActivePage(page, history, 'adjust');
            }}
            currentPage={page}
            totalPages={this.totalPages}
            onSubmit={this.onPageAdjustmentSubmit.bind(this, page, history)}
            onCancel={() => {
                if (this.props.data[page].adjusted) this.setActivePage(page, history, 'segmentation');
                else this.setActivePage(page, history, '');
            }} />;
    }


    renderSegmentationScreen({ history, match }) {
        if (this.shouldStop(history, match)) {
            return null;
        }

        const page = this.currentPage(match);
        const cfg = this.state.configValues || {};

        const dummySegmentationScreen = <SegmentationScreen
            imageURI={this.props.data[page].adjusted}
            onChangePage={page => {
                if (this.props.data[page].text) this.setActivePage(page, history, 'recognition');
                else if (this.props.data[page].processed) this.setActivePage(page, history, 'segmentation');
                else this.setActivePage(page, history, 'adjust')
            }}
            currentPage={page}
            totalPages={this.totalPages}
            onChangeContrastFactor={() => { }}
            onChangeApplyDilation={() => { }}
            onChangeApplyNoiseReduction={() => { }}
            onChangeSegmentationFactor={() => { }}
            onChangeSeparationFactor={() => { }}
            boxes={[]}
            handlePrimary={() => this.setActivePage(page, history, 'recognition')}
            handleAuxiliary={() => this.setActivePage(page, history, 'adjust')}
            defaultValues={this.props.data[page].configValues || {}} />


        return <Async
            promiseFn={this.props.segmentationCallback}
            page={page}
            imageURI={this.getAdjustedPage(page)}
            contrastFactor={parseFloat(cfg.contrastFactor) || 1.5}
            applyDilation={cfg.applyDilation || false}
            applyNoiseReduction={cfg.applyNoiseReduction || false}
            segmentationFactor={parseFloat(cfg.segmentationFactor) || 0.5}
            separationFactor={parseInt(cfg.separationFactor, 10) || 3}
            // initialValue={{ payload: this.props.data[page].adjusted, coords: [] }}
            watch={JSON.stringify([
                page, cfg.contrastFactor, cfg.applyDilation, cfg.applyNoiseReduction, cfg.segmentationFactor, cfg.separationFactor
            ])}>
            <Async.Loading>
                {dummySegmentationScreen}
                <LoadingOverlay />
            </Async.Loading>
            <Async.Resolved>
                {data => <SegmentationScreen
                    imageURI={data.payload}
                    onChangePage={page => {
                        if (this.props.data[page].text) this.setActivePage(page, history, 'recognition');
                        else if (this.props.data[page].processed) this.setActivePage(page, history, 'segmentation');
                        else this.setActivePage(page, history, 'adjust')
                    }}
                    currentPage={page}
                    totalPages={this.totalPages}
                    onChangeContrastFactor={value => this.updateCfg('contrastFactor', value)}
                    onChangeApplyDilation={value => this.updateCfg('applyDilation', value)}
                    onChangeApplyNoiseReduction={value => this.updateCfg('applyNoiseReduction', value)}
                    onChangeSegmentationFactor={value => this.updateCfg('segmentationFactor', value)}
                    onChangeSeparationFactor={value => this.updateCfg('separationFactor', value)}
                    boxes={data.coords}
                    handlePrimary={() => this.setActivePage(page, history, 'recognition')}
                    handleAuxiliary={() => this.setActivePage(page, history, 'adjust')}
                    defaultValues={this.props.data[page].configValues || {}}
                />}
            </Async.Resolved>
            <Async.Rejected>
                {err => {
                    if (!this.state.error)
                        this.onError(err.message);
                    return dummySegmentationScreen;
                }}
            </Async.Rejected>
        </Async>;
    }

    renderRecognitionScreen({ history, match }) {
        if (this.shouldStop(history, match)) {
            return null;
        }
        const page = this.currentPage(match);
        const processedPage = this.getProcessedPage(page);
        const adjustedPage = this.getAdjustedPage(page);
        const dummyRecognitionScreen = <TextRecognitionScreen
            imageURI={this.props.data[page].adjusted}
            onChangePage={page => {
                if (this.props.data[page].text) this.setActivePage(page, history, 'recognition');
                else if (this.props.data[page].processed) this.setActivePage(page, history, 'segmentation');
                else this.setActivePage(page, history, 'adjust');
            }}
            currentPage={page}
            totalPages={this.totalPages}
            boxes={[]}
            textAreaContent={[]}
            handlePrimary={() => this.setActivePage(page, history, 'segmentation')}
            handleSecondary={() => this.setActivePage(page, history, 'adjust')}
            handleAuxiliary={() => this.setActivePage(page, history, '')} />

        return <Async
            promiseFn={this.props.recognitionCallback}
            page={page}
            imageURI={adjustedPage}
            watch={JSON.stringify([page, processedPage])}>
            <Async.Loading>
                {dummyRecognitionScreen}
                <LoadingOverlay />
            </Async.Loading>
            <Async.Resolved>
                {data => <TextRecognitionScreen
                    imageURI={data.processedImage}
                    onChangePage={page => {
                        if (this.props.data[page].text) this.setActivePage(page, history, 'recognition');
                        else if (this.props.data[page].processed) this.setActivePage(page, history, 'segmentation');
                        else this.setActivePage(page, history, 'adjust');
                    }}
                    currentPage={page}
                    totalPages={this.totalPages}
                    boxes={data.coords || []}
                    textAreaContent={data.text}
                    handlePrimary={() => this.setActivePage(page, history, 'segmentation')}
                    handleSecondary={() => this.setActivePage(page, history, 'adjust')}
                    handleAuxiliary={() => this.setActivePage(page, history, '')} />}
            </Async.Resolved>
            <Async.Rejected>
                {err => {
                    if (!this.state.error)
                        this.onError(err.message);
                    return dummyRecognitionScreen;
                }}
            </Async.Rejected>
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

                <ErrorHandler
                    open={this.state.error}
                    message={this.state.errorMsg || ''}
                    onClose={this.onErrorClose.bind(this)}
                />
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
