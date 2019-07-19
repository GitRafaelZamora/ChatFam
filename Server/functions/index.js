const functions = require('firebase-functions');
const app = require('express')();

const { getAllPosts, post, getPost, comment, deletePost, like, unlike } = require('./handlers/posts');
const { login, signup, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');
const { FBAuth} = require('./util/fbAuth');
const { db } = require('./util/admin')

// TODO: like post
// TODO: unlike a post
// All the services that interact with Post data.
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, post);
app.get('/post/:postID', getPost);
app.post('/post/:postID/comment', FBAuth, comment);
app.delete('/post/:postID/delete', FBAuth, deletePost);
app.get('/post/:postID/like', FBAuth, like);
app.get('/post/:postID/unlike', FBAuth, unlike);

// All the services that interact with User data.
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document('/likes/{id}')
    .onCreate((snapshot) => {
        db.doc(`/screams/${snapshot.data().postID}`)
            .get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().handle,
                        sender: snapshot.data().handle,
                        read: false,
                        postID: doc.id,
                        type: 'like'
                    })
                }
                return;
            })
            .then(() => {
                return;
            })
            .catch(err => {
                console.error(err);
                return
            })
    });

// TODO: NOTIFICATIONS for onComment, unlike