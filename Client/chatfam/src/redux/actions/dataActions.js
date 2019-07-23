import { SET_POSTS, LOADING_DATA, LIKE_POST, UNLIKE_POST, DELETE_POST } from '../types'
import axios from 'axios';

export const getPosts = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get('/posts')
        .then(res => {
            dispatch({ 
                type: SET_POSTS, 
                payload: res.data
            })
        })
        .catch(err => {
            console.log(err);
            dispatch({ 
                type: SET_POSTS, 
                payload: {}
            })
        })
}

export const likePost = (postID) => (dispatch) => {
    axios.get(`/post/${postID}/like`)
        .then(res => {
            dispatch({ 
                type: LIKE_POST, 
                payload: res.data
            })
        })
        .catch(err => {
            console.log(err);
        })
}

export const unlikePost = (postID) => (dispatch) => {
    axios.get(`/post/${postID}/unlike`)
        .then(res => {
            dispatch({ 
                type: UNLIKE_POST, 
                payload: res.data
            })
        })
        .catch(err => {
            console.log(err);
        })
}

export const deletePost = (postID) => (dispatch) => {
    axios.delete(`/post/${postID}/delete`)
        .then(() => {
            dispatch({ 
                type: DELETE_POST, 
                payload: postID 
            })
        })
        .catch(err => {
            console.log(err)
        })
}

