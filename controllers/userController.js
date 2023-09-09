const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find()

            res.json(users)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err)
        }
    },

    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }

            res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndRemove({ _id: req.params.studentId });

            if (!user) {
                return res.status(404).json({ message: 'No such user exists' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(req.params.userId)

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async addFriend(req, res) {
        console.log('You are adding a friend');
        console.log(req.body);

        try {
            // need to check this one
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendID } },
                { runValidatos: true, new: true }
            );

            if (!friend) {
                return res
                    .status(404)
                    .json({ message: 'No user found with that ID :(' });
            }

            res.json(friend);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async removeFriend(req, res) {
        try {
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: { friendId: req.params.friendID } } },
                { runValidators: true, new: true }
            )

            if (!friend) {
                return res
                    .status(404)
                    .json({ message: 'No friend found with that ID :(' });
            }

            res.json(friend)
        } catch (err) {
            res.status(500).json(err)
        }
    }
}