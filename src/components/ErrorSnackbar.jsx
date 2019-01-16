import React from "react";
import PropTypes from "prop-types";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import FontAwesome from "react-fontawesome";
import { withStyles } from '@material-ui/core/styles';

const styles = {
    root: {
        background: "white",
        color: "#242424"
    },
    icon:{
        color: "#2a6f9e",
        weight: "100",
        userSelect: "none"
    }
};

class ErrorSnackbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.open,
            autoHideDuration: 6000,
            message: props.message
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            open: nextProps.open
        });
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.props.onClose();
      };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Snackbar
                    ContentProps={{
                        classes: {
                            root: classes.root
                        }
                    }}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left"
                    }}
                    open={this.state.open}
                    autoHideDuration={this.state.autoHideDuration}
                    onClose={this.handleClose}
                    message={<span>{this.state.message}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            className={classes.icon}
                            onClick={this.handleClose}
                        >
                            <FontAwesome 
                            name="far fa-times-circle" />
                        </IconButton>
                    ]}
                />
            </div>
        );
    }
}

ErrorSnackbar.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default withStyles(styles)(ErrorSnackbar);
