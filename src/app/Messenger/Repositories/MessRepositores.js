import BaseRepository from '../../../infrastructure/Repositories/BaseRepository';
import knex from '../../../database/connection'
class MessRepository extends BaseRepository {
  static repository;

  static getRepository() {
    if (!this.repository) {
      this.repository = new this();
    }

    return this.repository;
  }

  getTableName() {
    return 'friends';
  }
  
  userIDCurrentByEmail(email) {
    return knex('users').where({
      email,
    }).select('id');
  }

  infoUserCurrent(userID) {
    return knex('users').where({
      id: userID,
    }).select('id', 'firstName', 'lastName', 'avatar');
  }
}

export default MessRepository;
