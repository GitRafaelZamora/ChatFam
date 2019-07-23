const { db } = require('../util/admin');

exports.getAllPosts = (req, res) => {
    db.collection('posts').orderBy('createdAt', 'desc').get()
        .then(data => {
            let posts = [];
            data.forEach(doc => {
                posts.push({
                    postID: doc.id,
                    body: doc.data().body,
                    handle: doc.data().handle,
                    createdAt: doc.data().createdAt,
                    imgURL: doc.data().imgURL,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount
                });
            });
            return res.json(posts);
        })
        .catch(err => console.error(err));
}

exports.post = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: "Body must not be empty."});
    }
    const post = {
        body: req.body.body,
        handle: req.user.handle,
        imgURL: req.user.imgURL,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    db.collection('posts').add(post)
        .then(ref => {
            const resPost = post;
            resPost.postID = ref.id;
            return res.json(resPost);
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err);
        })

    return res;
}

// Gets a post given a postID.
exports.getPost = (req, res) => {
    let postData = {};
    console.log(req.params.postID);

    db.doc(`/posts/${req.params.postID}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Post not found'});
            }
            postData = doc.data();
            postData.postID = doc.id;

            return db.collection('comments').orderBy('createdAt', 'desc').where('postID', '==', req.params.postID).get();
        })
        .then((data) => {
            postData.comments = [];
            data.forEach((doc) => {
                postData.comments.push(doc.data());
            });
            return res.json(postData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}

exports.deletePost = (req, res) => {
    let postData = {};

    db.doc(`/posts/${req.params.postID}`)
        .get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Post not found'});
            }
            
            if (doc.data().handle !== req.user.handle) {
                return res.status(403).json({ error: 'Unauthorized'} );
            } else {
                return db.doc(`/posts/${req.params.postID}`).delete();
            }

        })
        .then(() => {
            return res.json({message: `Successfully deleted post.`});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code, message: "Error Deleting Post." });
        });
}

exports.comment = (req, res) => {
    if (req.body.body.trim() === '') return res.status(400).json({error: "Must not be empty."});
    const comment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        postID: req.params.postID,
        handle: req.user.handle,
        userImg: req.user.imgURL
    }

    db.doc(`/posts/${req.params.postID}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: "Post not found."})
            }

            return doc.ref.update({ commentCount: doc.data().commentCount + 1 })
        })
        .then(() => {
            return db.collection('comments').add(comment);
        })
        .then(() => {
            return res.json(comment);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}

exports.like = (req, res) => {
    const likeDocument = db.collection('likes')
                            .where('handle', '==', req.user.handle)
                            .where('postID', '==', req.params.postID)
                            .limit(1);
    const postDocument = db.doc(`/posts/${req.params.postID}`);

    let post = {};

    postDocument.get()
        .then(doc => {
            if (doc.exists) {
                post = doc.data();
                post.postID = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Post not found.'} );
            }
        })
        .then(data => {
            if (data.empty) {
                return db.collection('likes').add({
                    postID: req.params.postID,
                    handle: req.user.handle
                })
                .then(() => {
                    post.likeCount++;
                    return postDocument.update({ likeCount: post.likeCount })
                })
                .then(() => {
                    return res.json(post);
                })
                
            } else {
                return res.status(400).json({ error: 'Post already liked.' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        })
}

exports.unlike = (req, res) => {
    const likeDocument = db.collection('likes')
                            .where('handle', '==', req.user.handle)
                            .where('postID', '==', req.params.postID)
                            .limit(1);
    const postDocument = db.doc(`/posts/${req.params.postID}`);

    let post;
    // console.log("postID : ", req.params.postID);

    postDocument.get()
        .then(doc => {
            if (doc.exists) {
                post = doc.data();
                post.postID = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Post not found.' })
            }
        })
        .then((data) => {
            if (data.empty) {
                return res.status(400).json({ error: 'Post not liked.' });
            } else {
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                        .then(() => {
                            post.likeCount--;
                            return postDocument.update({ likeCount: post.likeCount })
                        })
                        .then(() => {
                            return res.json(post);
                        });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}