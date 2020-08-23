import mongoose from 'mongoose';
const schema = mongoose.Schema;

const ImageSchema = new schema({
    username: {
        type: String,
        required: true
    },
    usersWithAccess: [
        {
            type: String,
            required: true
        }
    ],
    comments: [
        {
            username: String,
            comment: String
        }
    ],
    filePath: {
        type: String,
        required: true,
        unique: true
    }
});

const Image = mongoose.model('Image', ImageSchema, 'ImageCollection');
module.exports = Image;
