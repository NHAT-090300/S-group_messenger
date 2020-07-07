import express from 'express';
import authRouter from '../app/Auth/Routes/routes';

const router = express.Router();


router.use(authRouter);


export default router;
