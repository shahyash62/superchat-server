import mongoose from 'mongoose';
const schema = mongoose.Schema;

// TODO: Add phone number and email id fields to this model
const UserCredSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('UserCred', UserCredSchema, 'UserCreds');
module.exports = User;
