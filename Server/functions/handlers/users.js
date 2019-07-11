const firebase = require('firebase');
const {admin, db} = require('../util/admin');
const config = require('../util/config');
firebase.initializeApp(config);


const { validateSignUpData, validateLoginData, reduceUserDetails } = require('../util/validators');

exports.SignUp = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    let tid, uid;
    const { valid, errors } = validateSignUpData(user);

    if (!valid) return res.status(400).json(errors);
    
    const noImg = 'no-img.png';

    db.doc(`/users/${user.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ handle: 'This handle is already taken.' })
            } else {
                return firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            }
        })
        .then(data => {
            uid = data.user.uid;
            return data.user.getIdToken();
        })
        .then(token => {
            tid = token;
            const userCredentials = {
                handle: user.handle,
                email: user.email,
                createAt: new Date().toISOString(),
                imgURL: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                uid: uid
            }
            return db.doc(`/users/${user.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token: tid });
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: 'Email is already in use.' });
            } else {
                return res.status(500).json({ error: err.code });
            }
        });
};

exports.Login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const {valid, errors} = validateLoginData(user);

    if (!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            if (err.code === 'auth/wrong-password') {
                return res.status(403).json({ general: 'Wrong Credentials, please try again.' });
            } else {
                console.error(err);
                return res.status(500).json({ error: err.code });
            }
        });
};

exports.uploadImage = (req, res) => {
    const Busboy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    
    const busboy = new Busboy({ headers: req.headers });
    let imgName;
    let imgToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({error: "Wrong file type uploaded."});
        }
        // my.image.png
        const ext = filename.split('.')[filename.split('.').length - 1];
        console.log(ext);
        imgName = `${Math.round(
                Math.random() * 1000000000000
            ).toString()}.${ext}`;
        const filepath = path.join(os.tmpdir(), imgName);

        imgToBeUploaded = { filepath, mimetype };
        
        file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on('finish', () => {
        console.log("FIRE")
        admin.storage().bucket(config.storageBucket).upload(imgToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imgToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imgURL = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imgName}?alt=media`;
            return db.doc(`/users/${req.user.handle}`).update({ imgURL });
        })
        .then(() => {
            return res.json({ message: 'Image uploaded successfully'});
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.code })
        });
    });
    busboy.end(req.rawBody);
}

exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({ message: "Details added succesfully." })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err.code })
        })

}

exports.getAuthenticatedUser = (req, res) => {
    let userData = {};

    db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.credentials = doc.data();
                // TODO: Get Likes
                return db.collection('likes').where('userHandle', '==', req.user.handle).get();
            }
        })
        .then(data => {
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data());
            });
            return res.json(userData);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: err.code })
        })
}