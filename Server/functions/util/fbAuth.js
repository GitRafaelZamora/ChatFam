const { admin, db } = require('./admin')

exports.FBAuth = (req, res, next) => {
    let tokenID;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        tokenID = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.log('No token found.');
        return res.status(403).json({ error: 'Unauthorized' });
    }

    admin.auth().verifyIdToken(tokenID)
        .then(decodedToken => {
            req.user = decodedToken;
            // console.log(decodedToken);
            return db.collection('users')
                .where('uid', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            // console.log(data);
            req.user.handle = data.docs[0].data().handle;
            req.user.imgURL = data.docs[0].data().imgURL;
            return next();
        })
        .catch(err => {
            console.error('Error while verifying token.');
            return res.status(403).json(err);
        });
}