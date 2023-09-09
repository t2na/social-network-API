const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, 'username required'],
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'email required'],
            match: /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]

    },
    {
        toJSON: {
            virtuals: true,
        }
    }
);

userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends.length;
    });

const User = model('user', userSchema);

module.exports = User;