import { 
    SET_POSTS, 
    LOADING_DATA, 
    LIKE_POST, 
    UNLIKE_POST, 
    DELETE_POST, 
    NEW_POST, 
    LOADING_UI, 
    CLEAR_ERRORS,
    SET_ERRORS } from '../types';
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

export const post = (post) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/post', post)
        .then(res => {
            dispatch({
                type: NEW_POST,
                payload: res.data
            });
            dispatch({
                type: CLEAR_ERRORS
            });
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        });
}
