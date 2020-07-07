import express from 'express';
import Controller from '../Controllers/AuthController';
import AuthMiddleware from '../Middleware/AuthMiddleware';

const router = express.Router();
const controller = new Controller();
const authMiddleware = new AuthMiddleware();

router.route('/login-phone-number')
  .get(controller.loginPhoneNumber)
  .post(controller.callMethod('postRegisterNumber'));

router.route('/register')
  .get(controller.register);

router.route('/register-email')
  .get(controller.registerByEmail)
  .post(controller.callMethod('postRegisterEmail'));

router.route('/reset-password')
  .get(controller.resetPassword);

router.route('/')
  .get(authMiddleware.hasLogined, controller.redirectHome);

router.route('/conversations')
  .get(authMiddleware.hasLogined, controller.home);

router.route('/login')
  .post(controller.postLogin)
  .get(authMiddleware.hasNotLogined, controller.login);

router.route('/logout')
  .get(authMiddleware.hasLogined, controller.logout);

export default router;
