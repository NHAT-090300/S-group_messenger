/* eslint-disable require-jsdoc */
import Service from '../Service/MessService';
import Repository from '../Repositories/MessRepositores';
import knex from '../../../database/connection';
import admin from '../../../database/firebase-admin';

const service = new Service();
const repository = new Repository();
const database = admin.database();
const userRef = database.ref('/users');

class MessController {
  async createMessage(req, res) {
    try {
      const messages = req.body.message;
      const _id = userRef.push().key;
      const id = parseInt(req.params.id);
      const userID = await service.userCurrent(req.cookies.token);
      userRef.child(userID).child(id).child(_id).set({
        // reseiverId,
        messages,
        time: Date(),
      });

      userRef.on('child_added', (snapsort)=> {
        console.log('====================');
        console.log(snapsort.val());
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default MessController;
