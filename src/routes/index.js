import express from 'express';
import authRouter from '../app/Auth/Routes/routes';
import FriendsRoutes from '../app/Friends/Routes/FriendsRoutes';
import MessengerRoutes from '../app/Messenger/Routes/MessRoutes';

const router = express.Router();


router.use(authRouter);
router.use(FriendsRoutes);
router.use(MessengerRoutes);


export default router;
