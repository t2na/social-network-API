const { User, Thought } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find()
                .select('-__v')
                .populate('reactions');

            res.json(thoughts)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err)
        }
    },

    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v')
                .populate('reactions');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            }

            res.json(thought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            );

            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Thought created, but found no user with that ID' });
            }


            res.json('Thought added!');
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: `No such thought exists, you're losing it...` });
            }

            res.json({ message: 'Thought deleted!' })

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body })

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            }
            res.json({ message: 'Thought updated!' })
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async addReaction(req, res) {
        console.log('You are adding a reaction');
        console.log(req.body);

        try {
            // need to check this one
            const reaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!reaction) {
                return res
                    .status(404)
                    .json({ message: 'No thought found with that ID :(' });
            }

            res.json(reaction);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async removeReaction(req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.body.reactionId } } },
                { runValidators: true, new: true }
            )

            console.log(reaction);
            console.log(req.params)

            if (!reaction) {
                return res
                    .status(404)
                    .json({ message: 'No reaction found with that ID :(' });
            }

            res.json(reaction)
        } catch (err) {
            res.status(500).json(err)
        }
    }
}