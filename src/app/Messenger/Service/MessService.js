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
          console.log(idUserCurrentByPhoneNumber.id);
          if (idUserCurrentByPhoneNumber) {
              userID = idUserCurrentByPhoneNumber.id;
              console.log(userID);
          }
      }
      // user current then login by email
      if (firebase.auth().currentUser) {
          const userCurrent = await firebase.auth().currentUser;
          const userCurrentByEmail = await this.repository.userIDCurrentByEmail(userCurrent.email); 
          userID = userCurrentByEmail[0].id;
          console.log(userID);
      }
      return userID;
    } catch(err) {
      console.log(err);
    }
  } 
   
}

export default MessService;
