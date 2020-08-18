import BaseRepository from '../../../infrastructure/Repositories/BaseRepository';
class AuthRequest extends BaseRepository {
  static request;

  static getRepository() {
    if (!this.request) {
      this.request = new this();
    }

    return this.request;
  }
  
}

export default AuthRequest;
