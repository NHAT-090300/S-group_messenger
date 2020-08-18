import * as admin from 'firebase-admin';
import serviceAccount from '../database/serviceAccount.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://messenger-app-778ba.firebaseio.com',
});

export default admin;
