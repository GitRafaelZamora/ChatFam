import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'
import icon from '../assets/dragon.png'

// MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

// Redux stuff
import { connect } from 'react-redux'
import { loginUser } from '../redux/actions/userActions'


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



class login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
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
            password: this.state.password
        };
        console.log(user)
        this.props.loginUser(user, this.props.history);
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
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
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
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={loading}>
                            Login
                            { loading &&
                                <CircularProgress size={30} className={classes.progress} />
                            }
                        </Button>
                        <br />
                        <small>don't have an accound ? sign up <Link to="/signup">here</Link></small>
                    </form>
                </Grid>
                <Grid item sm />
            </Grid>
        )
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionsToProps = {
    loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login));
