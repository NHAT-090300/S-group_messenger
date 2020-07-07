const admin = require('firebase-admin');
const serviceAccount = require('../database/serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://messenger-app-778ba.firebaseio.com',
});

export default admin;
