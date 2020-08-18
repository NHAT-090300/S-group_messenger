import BaseRepository from '../../../infrastructure/Repositories/BaseRepository';
import knex from '../../../database/connection'
class FriendsRepository extends BaseRepository {
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

  userCurrentByEmail(email) {
    return knex('users').where({
      email,
    }).select('id');
  }
  
  findByEmailAndPhoneNumber(email, phoneNumber) {
    return knex('users').where({
      email,
    }).andWhere({
        phoneNumber,
    }).select('id')
  }

  findByFriendIDAndUserID(friendId, userId) {
    return knex('friends').where({
      firendId: friendId,
      userId: userId,
    }).orWhere({
        firendId: userId,
        userId: friendId,
    }).select('*');
  } 

  createFriend (userId, friendId, message, status) {
    return knex('friends').insert({
      userId,
      firendId: friendId,
      message,
      receiver: userId,
      status,
    });
  }

  findByUserIdAndStatus (userId, status) {
    return knex('friends')
    .join('users', 'friends.firendId', 'users.id')
    .where({userId, status})
    .select('firstName', 'lastName', 'message', 'firendId', 'avatar');
  }

  findByFriendIdAndStatus (firendId, status) {
    return knex('friends')
    .join('users', 'friends.userId', 'users.id')
    .where({firendId, status})
    .select('firstName', 'lastName', 'message', 'firendId', 'avatar', 'userId');
  }

  infoFriend (id) {
    return knex('users').where({id}).select('firstName', 'lastName', 'avatar', 'city', 'describe', 'phoneNumber');
  }

  findFriends1 (userId, status) {
    return knex('friends')
    .join('users', 'friends.userId', 'users.id')
    // .where({userId, status})
    .where({
      firendId: userId,
      status,
    })
    .select('firstName', 'lastName', 'message', 'userId', 'avatar');
  }

  findFriends2 (userId, status) {
    return knex('friends')
    .join('users', 'friends.firendId', 'users.id')
    .where({userId, status})
    // .orWhere({
    //   firendId: userId,
    //   status,
    // })
    .select('firstName', 'lastName', 'message', 'firendId', 'avatar');
  }


}

export default FriendsRepository;
