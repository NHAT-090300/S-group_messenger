import express from 'express';
import Controller from '../Controller/MessController';
import AuthMiddleware from '../../Auth/Middleware/AuthMiddleware';

const router = express.Router();
const controller = new Controller();
const authMiddleware = new AuthMiddleware();

router.route('/v1/messages/:id')
    .post(controller.createMessage);

export default router;
