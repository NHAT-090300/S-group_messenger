/* eslint-disable require-jsdoc */
import Service from '../Service/MessService';
import Repository from '../Repositories/MessRepositores';
import knex from '../../../database/connection';
import admin from '../../../database/firebase-admin';
import MessageModel from '../../../database/mongoose/models/messages';

const service = new Service();
const repository = new Repository();
const database = admin.database();
const userRef = database.ref('/users');

class MessController {
  async createMessage(req, res) {
    try {
      const messages = req.body.message;
      const date = req.body.date;
      const id = parseInt(req.params.id);
      const userID = await service.userCurrent(req.cookies.token);
      MessageModel.create({
        senderID: userID,
        receiverID: id,
        messages: messages,
        createdAt: date,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getAllMessage(req, res) {
    try {
      const id = parseInt(req.params.id);
      const userID = await service.userCurrent(req.cookies.token);
      const data = await MessageModel.find({
        $or: [
          {$and: [{senderID: userID}, {receiverID: id}]},
          {$and: [{senderID: id}, {receiverID: userID}]},
        ],
      });
      return res.json({
        data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async youHaveChated(req, res) {
    try {
      let array = new Array();
      const userID = await service.userCurrent(req.cookies.token);
      // const id = await knex('friends').where({
      //   firendId: userID,
      // }).orWhere({
      //   userId: userID,
      // }).select('userId', 'firendId');

      const newMessage = await MessageModel.find({
        $or: [
          {senderID: userID},
          {receiverID: userID},
        ],
      }, {senderID: 1, receiverID: 1, _id: 0});
      console.log(array);
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAllMessages(req, res) {
    try {
      const userID = await service.currentUserID(req.cookies.token);
      const id = req.body.id;
       MessageModel.deleteMany({
        $or: [
          {$and: [{senderID: userID}, {receiverID: id}]},
          {$and: [{senderID: id}, {receiverID: userID}]},
        ],
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getNewMessage(req, res) {
    try {
      let data;
      const id = parseInt(req.params.id);
      const userID = await service.userCurrent(req.cookies.token);
      userRef.child(userID).child(id).on('child_added', (snapsort)=> {
        data = snapsort.val();
      });
      return res.json({
        data,
        id,
        userID,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default MessController;
