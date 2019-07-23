import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

// MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles'
import ParentButton from '../util/ParentButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { deletePost } from '../redux/actions/dataActions'

import { connect } from 'react-redux'

const styles = {
    deleteButton: {
        left: '90%',
        top: '10%',
        position: 'absolute'
    }
}

class DeletePost extends Component {
    state = {
        open: false,
    }

    handleOpen = () => {
        this.setState({
            open: true
        })
    }

    handleClose = () => {
        this.setState({
            open: false
        })
    }

    deletePost = () => {
        this.props.deletePost(this.props.postID);
        this.setState({
            open: false
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <ParentButton tip="Delete Post" onClick={this.handleOpen} btnClassName={classes.deleteButton}> 
                    <DeleteOutline color="secondary" />
                </ParentButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Are you sure you want to delete the post?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.deletePost} color="secondary">Delete</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeletePost.propTypes = {
    classes: PropTypes.object.isRequired,
    deletePost: PropTypes.func.isRequired,
    postID: PropTypes.string.isRequired
}

export default connect(null, { deletePost })(withStyles(styles)(DeletePost));
