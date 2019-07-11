const functions = require('firebase-functions');
const app = require('express')();

const { getAllPosts, Post, getPost, comment, deletePost, likePost, unlikePost } = require('./handlers/posts');
const { Login, SignUp, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');
const { FBAuth } = require('./util/fbAuth');





app.get('/posts', getAllPosts);
app.post('/post', FBAuth, Post);
app.get('/post/:postID', getPost);
app.post('/post/:postID/comment', FBAuth, comment);
app.post('/post/:postID/delete', FBAuth, deletePost);
app.get('/post/:postID/like', FBAuth, likePost);
app.get('/post/:postID/unlike', FBAuth, unlikePost);

//TODO: delete post
// TODO: like post
// TODO: unlike a post
// TODO: comment a post

app.post('/signup', SignUp);
app.post('/login', Login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
