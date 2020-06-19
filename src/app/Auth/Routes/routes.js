import express from 'express';
import Controller from '../Controllers/AuthController';

const router = express.Router();
const controller = new Controller();

router.get('/login', (req, res) => res.render('app/login'));

router.route('/login-phone-number')
  .get((req, res) => res.render('app/login-phone-number'));

router.get('/register', (req, res) => res.render('app/auth/register'));

router.get('/register-email', controller.callMethod('registerByEmail'));

router.get('/reset-password', (req, res) => res.render('app/reset-password'));

export default router;
