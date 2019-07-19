import React, { Component } from 'react'
import PropTypes from 'prop-types'

import icon from '../assets/dragon.png'
import axios from 'axios'

// MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'


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
        marginTop: 20
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: '10px'
    }
};



class login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            loading: false,
            errors: {}
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ loading: true });

        const user = {
            email: this.state.email,
            password: this.state.password
        }

        console.log(user)

        axios.post('/login', user)
            .then((res) => {
                console.log(res.data);
                this.setState({ loading: false });
                this.props.history.push('/');
            })
            .catch(err => {
                console.log(err.response.data)
                this.setState({ 
                    errors: err.response.data, 
                    loading: false 
                });
            })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        const { classes } = this.props;
        const { errors, loading } = this.state;
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
                        <Button type="submit" variant="contained" color="primary" className={classes.button}>
                            Login
                        </Button>
                    </form>
                </Grid>
                <Grid item sm />
            </Grid>
        )
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(login);
