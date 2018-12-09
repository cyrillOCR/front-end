import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import "../styles/Pagination.css";

export default class Pagination extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);

        this.state = {
            currentPage: props.currentPage,
            lastPage: props.currentPage
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            currentPage:
                nextProps.currentPage,
            lastPage: nextProps.currentPage
        });
    }

    handleChange(newCurrentPage) {
        this.setState({ currentPage: newCurrentPage });
        if (this.state.lastPage !== newCurrentPage) {
            this.props.onChange(newCurrentPage);
            this.setState({ lastPage: newCurrentPage });
        }
    }

    handleInput(e) {
        var newCurrentPage = e.target.value;
        if (newCurrentPage > this.props.totalPages) {
            newCurrentPage = (newCurrentPage / 10) | 0;
        }
        this.setState({ currentPage: newCurrentPage });
    }

    handleBlur() {
        var newCurrentPage;
        if (
            !this.state.currentPage ||
            this.state.currentPage < 1
        )
            newCurrentPage = this.props.currentPage;
        else newCurrentPage = this.state.currentPage;
        newCurrentPage = Number(newCurrentPage);
        this.handleChange(newCurrentPage);
    }

    handleDecrement() {
        var newCurrentPage = this.props.currentPage - 1;
        if (newCurrentPage < 1) newCurrentPage = 1;
        this.handleChange(newCurrentPage);
    }

    handleIncrement() {
        var newCurrentPage = this.props.currentPage + 1;
        if (newCurrentPage > this.props.totalPages)
            newCurrentPage = this.props.totalPages;
        this.handleChange(newCurrentPage);
    }

    render() {
        return (
            <div className="pagination-container">
                <FontAwesome
                    className={
                        this.props.currentPage === 1
                            ? "arrow disabled"
                            : "arrow"
                    }
                    name="fas fa-long-arrow-alt-left"
                    onClick={this.handleDecrement}
                />
                <span className="page-label">
                    <span className="value-input">
                        <input
                            className="no-spinners"
                            type="number"
                            value={this.state.currentPage}
                            onChange={this.handleInput}
                            onBlur={this.handleBlur}
                            style={{
                                width:
                                    (String(this.props.currentPage).length +
                                        2) *
                                        0.5 +
                                    "rem"
                            }}
                        />
                    </span>
                    /{this.props.totalPages}
                </span>
                <FontAwesome
                    className={
                        this.props.currentPage === this.props.totalPages
                            ? "arrow disabled"
                            : "arrow"
                    }
                    name="fas fa-long-arrow-alt-right"
                    onClick={this.handleIncrement}
                />
            </div>
        );
    }
}

Pagination.propTypes = {
    onChange: PropTypes.func.isRequired,
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired
};
