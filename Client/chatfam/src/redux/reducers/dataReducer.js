import { SET_POSTS, SET_POST, LIKE_POST, UNLIKE_POST, LOADING_DATA, DELETE_POST } from '../types'

const initialState = {
    posts: [],
    post: {},
    loading: false
}


export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case LIKE_POST:
        case UNLIKE_POST:
            let index = state.posts.findIndex(
                (post) => post.postID === action.payload.postID
            );
            state.posts[index] = action.payload;
            return {
                ...state,
            }
        case SET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            }
        case SET_POST:
            return {
                ...state,
                post: action.payload
            };
        case DELETE_POST: 
            let pindex = state.posts.findIndex((post) => post.postID === action.payload);
            state.posts.splice(pindex, 1);
            return {
                ...state
            }
        default:
            return state
    }
}