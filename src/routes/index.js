import express from 'express';
import authRouter from '../app/Auth/Routes/routes';

const router = express.Router();

router.use(authRouter);

router.get('/', (req, res) => res.redirect('/conversations'));

router.get('/conversations', (req, res) => res.render('app/conversation/index'));

router.get('/register', (req, res) => res.render('app/auth/register-email'));

router.get('/login', (req, res) => res.render('app/auth/login'));

router.get('/register-number', (req, res) => res.render('app/auth/register-number'));
export default router;
