import React, { Component } from 'react'
import Pagination from './Pagination'
import PropTypes from 'prop-types'
import '../styles/Sidekick.css'

export default class Sidekick extends Component {
    render() {
        return (
            <div className="sidekick-container">
                <h3 className="sidekick-title">
                    {this.props.title}
                </h3>
                <div className="sidekick-content">
                    {this.props.children}
                </div>
                <Pagination onChange={this.props.onChange} currentPage={this.props.currentPage} totalPages={this.props.totalPages} />
            </div>
        )
    }
}

Sidekick.propTypes = {
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired
}