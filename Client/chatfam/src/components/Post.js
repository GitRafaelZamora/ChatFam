import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

// MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles'
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ParentButton from '../util/ParentButton';
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import DeletePost from './DeletePost';

import { connect } from 'react-redux'
import { likePost, unlikePost } from '../redux/actions/dataActions'

const styles = {
    card: {
        display: 'flex',
        position: 'relative',
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
    likedPost = () => {
        if (this.props.user.likes && this.props.user.likes.find((like) => like.postID === this.props.post.postID)) {
            return true;
        } else { 
            return false; 
        }
    }

    likePost = () => {
        this.props.likePost(this.props.post.postID);
    }

    unlikePost = () => {
        this.props.unlikePost(this.props.post.postID);
    }

    render() {
        dayjs.extend(relativeTime);

        const {
            classes,
            post: {
                body,
                createdAt,
                imgURL,
                handle: postHandle,
                postID,
                likeCount,
                commentCount
            },
            user: {
                authenticated,
                credentials: {
                    handle: userHandle
                }
            }
        } = this.props;

        const likeButton = !authenticated ? (
            <ParentButton tip="Like" >
                <Link to="/login">
                    <FavoriteBorder color="primary" />
                </Link>
            </ParentButton>
        ) : (this.likedPost() ? (
            <ParentButton tip="Unlike" onClick={this.unlikePost} >
                <FavoriteIcon color="primary" />
            </ParentButton>
        ) : (
            <ParentButton tip="Like" onClick={this.likePost} >
                <FavoriteBorder color="primary" />
            </ParentButton>
        ));

        const deleteButton = authenticated && postHandle === userHandle ? (
            <DeletePost postID={postID} />
        ) : null;


        return (
            <Card className={classes.card}>
                <CardMedia image={imgURL} title="Profile Image" className={classes.image} />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${postHandle}`} color="primary">
                        {postHandle}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body2">
                        {body}
                    </Typography>
                    {likeButton}
                    <span>{likeCount} Likes</span>
                    <ParentButton tip="Comment">
                        <ChatIcon color="primary" />
                    </ParentButton>
                    <span>{commentCount} Comments</span>
                </CardContent>
            </Card>
        )
    }
}

Post.propTypes = {
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
})

const mapActionsToProps = {
    likePost,
    unlikePost
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Post));


