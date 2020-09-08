import Repository from '../Repositories/MessRepositores';
import firebase from '../../../database/firebase';
import jwt from 'jsonwebtoken';

class MessService {
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

  async userCurrent(token) {
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

export default MessService;
