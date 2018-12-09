import React, { Component } from 'react'
import '../styles/Sidekick.css'
import PropTypes from 'prop-types'
import Pagination from './Pagination';

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
                <div className="pagination">
                    {<Pagination onChange={this.props.onChange} totalPages={this.props.totalPages} currentPage={this.props.currentPage} />}
                </div>
            </div>
        )
    }
}

Sidekick.propTypes = {
    title: PropTypes.string.isRequired
}
