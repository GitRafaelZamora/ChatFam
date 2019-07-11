const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccount.json.js')

const adminConfig = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://socialape-d6140.firebaseio.com"
}

// Initialize Firebase
admin.initializeApp(adminConfig);
const db = admin.firestore();


module.exports = { db, admin };