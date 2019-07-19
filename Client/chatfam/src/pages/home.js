import React, { Component } from 'react'
import axios from 'axios';

// MUI Stuff
import Grid from '@material-ui/core/Grid'

// Components
import Post from '../components/Post'

class home extends Component {
    state = {
        posts: null
    }

    componentDidMount() {
        axios.get('/posts')
            .then(res => {
                this.setState({
                    posts: res.data
                })
            })
            .catch(err => {
                console.log(err);
            });
    }


    render() {
        let postMarkup = this.state.posts ? (
            this.state.posts.map(post => 
                <Post key={post.postID} post={post}></Post>
            )
        ) : <p>Loading...</p>;
        return (
            <Grid container spacing={8}>
                <Grid item sm={8} xs={12}>
                    {postMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    Profile...
                </Grid>
            </Grid>
        )
    }
}

export default home
