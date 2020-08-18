import BaseRepository from '../../../infrastructure/Repositories/BaseRepository';
import knex from '../../../database/connection'
class AuthRepository extends BaseRepository {
  static repository;

  static getRepository() {
    if (!this.repository) {
      this.repository = new this();
    }
    return this.repository;
  }

  getTableName() {
    return 'users';
  }
  

  userExistsPhone(phoneNumber) {
    return this.cloneQuery().where({phoneNumber}).first();
  }

  userExists(email) {
    return this.cloneQuery().where({email}).first();
  }

  registerByEmail(email, password, firstName, lastName) {
    return this.cloneQuery()
    .insert({
      firstName,
      lastName,
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/User_font_awesome.svg',
      email, 
      password
    })
  }

  createUserByPhone(phoneNumber,firstName, lastName, password) {
    return this.cloneQuery()
    .insert({
      firstName, 
      lastName, 
      phoneNumber,
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/User_font_awesome.svg',
      password
    })
  }
  
}

export default AuthRepository;
