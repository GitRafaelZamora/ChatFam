import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import icon from '../assets/dragon.png';

// Redux Stuff
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

// MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
    form: {
        textAlign: 'center'
    },
    image: {
        margin: '20px auto 20px auto',
        maxWidth: 100,
    },
    pageTitle: {
        margin: '10px auto 10px auto',
        fontSize: 50,
    },
    textField: {
        margin: '10px auto 10px auto',
    },
    button: {
        marginTop: 20,
        position: 'relative'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: '10px'
    },
    progress: {
        position: 'absolute'
    }
};

class signup extends Component {
    constructor() {
        super();
        this.state = {
            handle: '',
            email: '',
            password: '',
            confirmPassword: '',
            errors: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({ errors: nextProps.UI.errors });
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        }

        console.log(user)

        this.props.signupUser(user, this.props.history);
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm />
                <Grid item sm>
                    <img src={icon} alt="Dragon" className={classes.image} />
                    <Typography variant="h1" className={classes.pageTitle}>
                        Signup
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField 
                            id="handle" 
                            name="handle" 
                            type="text" 
                            label="User Handle" 
                            helperText={errors.handle} 
                            error={errors.handle ? true : false} 
                            className={classes.textField} 
                            value={this.state.handle} 
                            onChange={this.handleChange} 
                            fullWidth 
                        />
                        <TextField 
                            id="email" 
                            name="email" 
                            type="email" 
                            label="Email" 
                            helperText={errors.email} 
                            error={errors.email ? true : false} 
                            className={classes.textField} 
                            value={this.state.email} 
                            onChange={this.handleChange} 
                            fullWidth 
                        />
                        <TextField 
                            id="password" 
                            name="password" 
                            type="password" 
                            label="Password" 
                            helperText={errors.password} 
                            error={errors.password ? true : false} 
                            className={classes.textField} 
                            value={this.state.password} 
                            onChange={this.handleChange} 
                            fullWidth 
                        />
                        <TextField 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type="password" 
                            label="Confirm Password" 
                            helperText={errors.confirmPassword} 
                            error={errors.confirmPassword ? true : false} 
                            className={classes.textField} 
                            value={this.state.confirmPassword} 
                            onChange={this.handleChange} 
                            fullWidth 
                        />
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={loading}>
                            Signup
                            { loading &&
                                <CircularProgress size={30} className={classes.progress} />
                            }
                        </Button>
                        <br />
                        <small>Already have an account ? login <Link to="/login">here</Link></small>
                    </form>
                </Grid>
                <Grid item sm />
            </Grid>

        )
    }
}

signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

export default connect(mapStateToProps, { signupUser })(withStyles(styles)(signup));
