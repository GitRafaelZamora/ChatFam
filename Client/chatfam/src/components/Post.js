import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import CircularProgress from '@material-ui/core/CircularProgress'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import ParentButton from '../util/ParentButton'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'

import { post } from '../redux/actions/dataActions'

import { connect } from 'react-redux'

const styles = {
    submitButton: {
        position: 'relative'
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '90%',
        top: '10%'
    }
}

class Post extends Component {
    state = {
        open: false,
        body: '',
        errors: {}
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        }

        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({
                body: '',
            })
            this.handleClose()
        }
    }

    handleOpen = () => {
        this.setState({
            open: true
        })
    }

    handleClose = () => {
        this.setState({
            open: false,
            errors: {}
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.post({ body: this.state.body })
    }

    render() {
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state;
        return (
            <Fragment>
                <ParentButton onClick={this.handleOpen} tip="Create New Post">
                    <AddIcon />
                </ParentButton>
                <Dialog 
                    open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                        <ParentButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                            <CloseIcon />
                        </ParentButton>
                        <DialogContent>
                            <form onSubmit={this.handleSubmit}>
                                <TextField 
                                    name="body"
                                    type="text"
                                    label="POST"
                                    multiline
                                    rows="3"
                                    placeholder="Post onto the board."
                                    error={errors.body ? true : false}
                                    helperText={errors.body}
                                    className={classes.textField}
                                    onChange={this.handleChange}
                                    fullWidth
                                />
                                <Button type="submit" variant="contained" color="primary" className={classes.submitButton} disabled={loading}>
                                    Submit
                                    { loading && (<CircularProgress size={30} className={classes.progressSpinner} />)}
                                </Button>
                            </form>
                        </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

Post.propTypes = {
    post: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    UI: state.UI,
    post: state.post
})

export default connect(mapStateToProps, { post })(withStyles(styles)(Post));