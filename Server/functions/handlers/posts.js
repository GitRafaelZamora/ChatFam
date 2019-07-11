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
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(posts);
        })
        .catch(err => console.error(err));
}

exports.Post = (req, res) => {
    const post = {
        body: req.body.body,
        handle: req.user.handle,
        userImg: req.user.imageURL,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    db.collection('posts').add(post)
        .then(ref => {
            const resPost = post;
            resScream.postID = doc.id;
            return res.json(resScream);
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err);
        })

    return res;
};

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
    console.log(req.params.postID);

    db.doc(`/posts/${req.params.postID}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Post not found'});
            }
            postData = doc.data();
            postData.postID = doc.id;

            return db.collection('comments').orderBy('createdAt', 'desc').where('postID', '==', req.params.postID).delete();
        })
        .then((data) => {
            return res.json({message: `Successfully deleted Document: ${data.id}`});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}

exports.comment = (req, res) => {
    if (req.body.body.trim() == '') return res.status(400).json({error: "Must not be empty."});
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

            return db.collection('comments').add(comment);
        })
        .then(() => {
            res.json(comment);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}