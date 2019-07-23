import React, { Component } from 'react'
import PropTypes from 'prop-types'

// MUI Stuff
import Grid from '@material-ui/core/Grid'

// Components
import Posts from '../components/Posts'
import Profile from '../components/Profile'
import { connect } from 'react-redux'
import { getPosts } from '../redux/actions/dataActions'

class home extends Component {
    state = {
        posts: null
    }

    componentDidMount() {
        this.props.getPosts();
    }

    render() {
        const { posts, loading } = this.props.data;
        let postMarkup = !loading ? (
            posts.map(post => <Posts key={post.postID} post={post}></Posts>)
        ) : <p>Loading...</p>;
        return (
            <Grid container spacing={8}>
                <Grid item sm={8} xs={12}>
                    {postMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile></Profile>
                </Grid>
            </Grid>
        )
    }
}

home.propTypes = {
    data: PropTypes.object.isRequired,
    getPosts: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    data: state.data
})

export default connect(mapStateToProps, { getPosts })(home)
