import Repository from '../Repositories/AuthRepository';
import bcrypt from 'bcrypt';
import knex from '../../../database/connection'
import firebase from '../../../database/firebase.js';

class AuthService {
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


  async RegisterEmail(email, password, firstName, lastName) {
    try {
      const userExists = await knex('users')
      .where({email: email})
      .first();
      if (userExists) {
        return res.status(500).json({
          error: 'User already exists',
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.repository.registerByEmail(email, hashedPassword, firstName, lastName);
        console.log(user);
        return res.json({
          message: 'created',
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        message: 'Failed',
      });
    };
  }

  // async RegisterPhone(phoneNumber, firstName, lastName, password) {
  //   try {
  //     const findUser = await knex('users')
  //     .where({phoneNumber: phoneNumber})
  //     .first();
  //     console.log(findUser);
  //     if (findUser == undefined) {
  //       const hashedPassword = await bcrypt.hash(password, 10);
  //       await this.repository.createUserByPhone(phoneNumber, firstName, lastName, hashedPassword);
  //       return res.json({
  //         message: 'created',
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return res.json({
  //       message: 'failed',
  //     });
  //   }
  // }

  async isUserExists(email) {
    return this.repository.userExists(email);
  }

  // async registerUserByEmail(email, password, firstName, lastName) {
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   return this.repository.registerByEmail(email, hashedPassword, firstName, lastName);
  // }

  async registerUserByPhone(phoneNumber, firstName, lastName, password) { 
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.repository.createUserByPhone(phoneNumber, firstName, lastName, hashedPassword);
  }

}

export default AuthService;
