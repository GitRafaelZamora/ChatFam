import React, { Component } from 'react'

import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'


// MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles'
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
    card: {
        display: 'flex',
        marginBottom: 20,
    },
    image: {
        minWidth: 200,
        objectFit: 'cover',
    },
    content: {
        padding: 25,
    },
}

class Post extends Component {
    render() {
        dayjs.extend(relativeTime);

        const { 
            classes, 
            post: {
                body,
                createdAt,
                imgURL,
                handle,
                postID,
                likeCount,
                commentCount
            } 
        } = this.props;

        return (
            <Card className={classes.card}>
                <CardMedia image={imgURL} title="Profile Image" className={classes.image} />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${handle}`} color="primary">
                        {handle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body2">
                        {body}
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(Post);


