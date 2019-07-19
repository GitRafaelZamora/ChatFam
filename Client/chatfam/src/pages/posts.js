import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import axios from 'axios';


class posts extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            mode: undefined,
            posts: []
         };
    }


    componentWillMount() {
        const base = "https://us-central1-socialape-d6140.cloudfunctions.net/api";

        axios.get(base + '/posts')
            .then(response => {
                const posts = response.data;
                this.setState({ posts });
            })
            .catch(error =>  {
                // handle error
                console.log(error);
            })
            .finally(() => {
                // always executed
                console.log("Posts Component Has Mounted.");
                console.log(this.state.posts);

            });
    }

    render() {
        const posts = this.state.posts.map((post, key) => 
            <>
                <Grid item sm={8} xs={12}>
                    {post.body}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {post.handle}
                </Grid>
            </>
        );

        return (
            <Grid container>
                {posts}
            </Grid>
        )
    }
}

export default posts
