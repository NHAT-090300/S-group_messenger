import Repository from '../Repositories/FriendRepository';
import firebase from '../../../database/firebase';
import jwt from 'jsonwebtoken';

class FriendsService {
  static service;

  constructor() {
    this.repository = Repository.getRepository();
  }

  static getService() {
    if (!this.service) {
      this.service = new this();
    }
    return this.service;
  }

  async currentUserID (token) {
    try {
      let userID;
      // user current then login by phone number
      if (token) {
          const idUserCurrentByPhoneNumber = await jwt.verify(token, 'secret');
          if (idUserCurrentByPhoneNumber) {
            userID = idUserCurrentByPhoneNumber.id;
          }
      }
      return userID;
    } catch(err) {
      console.log(err);
    }
  } 
}

export default FriendsService;
