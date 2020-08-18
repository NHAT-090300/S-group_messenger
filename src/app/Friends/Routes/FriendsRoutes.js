import express from 'express';
import Controller from '../Controler/FriendControler';
import AuthMiddleware from '../../Auth/Middleware/AuthMiddleware';

const router = express.Router();
const controller = new Controller();
const authMiddleware = new AuthMiddleware();

router.route('/v1/add-friends')
    .post(authMiddleware.hasLogined, controller.addFriends);
router.route('/v1/friends-your-invitation')
    .get(authMiddleware.hasLogined, controller.listFriendsNotAccepted);
router.route('/v1/list-friends')
    .get(authMiddleware.hasLogined, controller.listFriendsYourNotAccepted);
router.route('/v1/accept-friend/:id')
    .put(authMiddleware.hasLogined, controller.acceptFriends);
router.route('/v1/not-accept-friend/:id')
    .delete(authMiddleware.hasLogined, controller.notAcceptFriends);
router.route('/v1/info-friend/:id')
    .get(authMiddleware.hasLogined, controller.profileNotAcceptFriends);
router.route('/v1/list-all-friends')
    .get(authMiddleware.hasLogined, controller.listAllFriends);
export default router;
