/* eslint-disable require-jsdoc */
import Service from '../Service/FriendService';
import Repository from '../Repositories/FriendRepository';
import knex from '../../../database/connection';

const service = new Service();
const repository = new Repository();
class FriendController {
    // api add friends
    async addFriends(req, res) {
        try {
            const email = req.body.email;
            const phoneNumber = req.body.phoneNumber;
            const userID = await service.currentUserID(req.cookies.token);
            const friendID = await repository.findByEmailAndPhoneNumber(email, phoneNumber);
            const checkYourFirends = await repository.findByFriendIDAndUserID(friendID[0].id, userID);
            // check friend List
            if (userID !== friendID[0].id & !checkYourFirends[0]) {
                await repository.createFriend(userID, friendID[0].id, req.body.message, 1);
                return res.json('you have add new friends successful');
            } else {
                throw new Error(`you can't add new friends`);
            };
        } catch (err) {
            return res.status(402).json(err.message);
        };
    };
    // api list friends, Your invitation has not been accepted
    async listFriendsNotAccepted(req, res) {
        const userID = await service.currentUserID(req.cookies.token);
        const listInfoFriends = await repository.findByUserIdAndStatus(userID, 1);
        return res.json({
            data: listInfoFriends,
            id: userID,
        });
    };
    // api list friends, their invitation has not been accepted
    async listFriendsYourNotAccepted(req, res) {
        const userID = await service.currentUserID(req.cookies.token);
        const data = await repository.findByFriendIdAndStatus(userID, 1);
        return res.json(data);
    };
    // api post friends have accepted
    async acceptFriends(req, res) {
        try {
            const userID = await service.currentUserID(req.cookies.token);
            const id = parseInt(req.params.id);
            console.log(id);
            knex('friends').where({
                firendId: userID,
                userId: id,
            }).update({
                status: 2,
            }).then((data) => {
                res.json(data);
            });
        } catch (err) {
            console.log(err);
        };
    };
    // api not Accept Friends
    async notAcceptFriends(req, res) {
        try {
            const id = req.params.id;
            const status = req.body.status;
            const userID = await service.currentUserID(req.cookies.token);
            knex('friends').where({
                firendId: id,
                userId: userID,
                status,
            }).orWhere({
                firendId: userID,
                userId: id,
                status,
            }).delete()
            .then((data) => {
                console.log(data);
            });
        } catch (err) {
            console.log(err);
        }
    };
    // api infomation's not accept friends
    async profileNotAcceptFriends(req, res) {
        try {
            const id = req.params.id;
            const profile = await repository.infoFriend(id);
            return res.json({
                data: profile,
            });
        } catch (err) {
            console.log(err);
        }
    };
    // api list All friends
    async listAllFriends(req, res) {
        try {
            const userID = await service.currentUserID(req.cookies.token);
            const profile = await repository.findFriends1(userID, 2);
            const receiver = await repository.findFriends2(userID, 2);
            receiver.forEach((friend) => {
                profile.push(friend);
            });
            return res.json(profile);
        } catch (err) {
            console.log(err);
        };
    };

    async userCurrent(req, res) {
        const userID = await service.currentUserID(req.cookies.token);
        return res.json(userID);
    }
}

  export default FriendController;
