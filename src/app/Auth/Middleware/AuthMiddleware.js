/* eslint-disable require-jsdoc */
import BaseController from '../../../infrastructure/Controllers/BaseController';
import Service from '../Services/AuthService';

class AuthMiddleware extends BaseController {
  constructor() {
    super();
    this.service = Service.getService();
  }
  // Check if user is already login
  hasNotLogined(req, res, next) {
    if (req.session.user) {
      return res.redirect('/');
    }
    return next();
  }
  // Check if user is not already login
  hasLogined(req, res, next) {
    if (req.session.user) {
      return next();
    }
    return res.redirect('/login');
  }
}

export default AuthMiddleware;
