import Repository from '../Repositories/AuthRepository';
import bcrypt from 'bcrypt';
import knex from '../../../database/connection'

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
      const userExists = await this.repository.userExists(email);
      console.log(userExists);
      if (userExists) {
        throw new Error('User already exists')
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.repository.registerByEmail(email, hashedPassword, firstName, lastName);
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    };
  }

  async registerByPhone(phoneNumber, firstName, lastName, password) {
    const findUser = await this.repository.userExistsPhone(phoneNumber);
    console.log(findUser);
    if (findUser == undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await this.repository.createUserByPhone(phoneNumber, firstName, lastName, hashedPassword);
    } else {
      throw new Error('user already exists');
    }
  }
}

export default AuthService;
