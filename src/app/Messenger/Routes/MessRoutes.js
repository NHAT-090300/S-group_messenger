import express from 'express';
import Controller from '../Controller/MessController';
import AuthMiddleware from '../../Auth/Middleware/AuthMiddleware';

const router = express.Router();
const controller = new Controller();
const authMiddleware = new AuthMiddleware();

router.route('/v1/messages/:id')
    .post(controller.createMessage);
router.route('/v1/get-message/:id')
    .get(controller.getAllMessage);
router.route('/v1/get-new-message/:id')
    .get(controller.getNewMessage);
router.route('/v1/get-have-chated')
    .get(controller.youHaveChated);
router.route('v1/delete-all-messages/:id')
    .delete(controller.deleteAllMessages);

export default router;
