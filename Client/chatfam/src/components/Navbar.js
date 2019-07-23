import React, { Component } from 'react'

import PropTypes from 'prop-types'
import ParentButton from '../util/ParentButton'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
// MUI Stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Home from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';
import Post from './Post';


class Navbar extends Component {
    render() {
        const { authenticated } = this.props;
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {authenticated ? (<>
                        <Post></Post>
                        <Link to="/">
                            <ParentButton tip="Home">
                                <Home></Home>
                            </ParentButton>
                        </Link>
                        <ParentButton tip="Notifications">
                            <Notifications ></Notifications>
                        </ParentButton>

                    </>) : (<>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/signup">Signup</Button>
                    </>)
                    }
                </Toolbar>
            </AppBar >
        )
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps)(Navbar);
