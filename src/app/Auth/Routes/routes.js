import express from 'express';

const router = express.Router();

router.get('/login', (req, res) => res.render('app/login'));

router.route('/login-phone-number')
  .get((req, res) => res.render('app/login-phone-number'))
  .post((req) => {
    console.log(req.body);
  });

router.get('/register', (req, res) => res.render('app/auth/register'));

router.get('/register-email', (req, res) => res.render('app/auth/register-email'));

router.get('/reset-password', (req, res) => res.render('app/reset-password'));

export default router;