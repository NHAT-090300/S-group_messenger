import express from 'express';
import Controller from '../Controllers/AuthController';
import AuthMiddleware from '../Middleware/AuthMiddleware';

const router = express.Router();
const controller = new Controller();
const authMiddleware = new AuthMiddleware();

router.route('/register-phoneNumber')
  .get(authMiddleware.hasNotLogined, controller.registerByPhone)
  .post(authMiddleware.hasNotLogined, controller.callMethod('postRegisterNumber'));

router.route('/register')
  .get(authMiddleware.hasNotLogined, controller.register);

router.route('/register-email')
  .get(authMiddleware.hasNotLogined, controller.registerByEmail)
  .post(authMiddleware.hasNotLogined, controller.callMethod('postRegisterEmail'));

router.route('/reset-password')
  .get(authMiddleware.hasNotLogined, controller.resetPassword);

router.route('/')
  .get(authMiddleware.hasLogined, controller.redirectHome);

router.route('/conversations')
  .get(authMiddleware.hasLogined, controller.home);

router.route('/login')
  .get(authMiddleware.hasNotLogined, controller.login)
  .post(authMiddleware.hasNotLogined, controller.postLogin);

router.route('/login-phoneNumber')
  .get(authMiddleware.hasNotLogined, controller.loginPhoneNumber)
  .post(authMiddleware.hasNotLogined, controller.postLoginPhoneNumber);

router.route('/logout')
  .get(authMiddleware.hasLogined, controller.logout);

export default router;
