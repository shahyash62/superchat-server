const UserData = require('../models/UserData');
const Image = require('../models/Image');

export async function findImage(username: string): Promise<any> {
    return Image.findOne({ username }).then((user: any) => {
        return user;
    });
}

export async function saveImage(image: object): Promise<any> {
    const newImage = Image(image);
    try {
        return await newImage.save();
    } catch (err) {
        console.log(err);
        return { error: 'error while saving image' };
    }
}

export async function forwardImageToFriends(friendList: string[], imageID: string): Promise<any> {
    const prefix = '$in';
    const filter = {
        username: { $in: friendList }
    };
    try {
        UserData.updateMany(filter, { $push: { imagePostList: imageID } }, { upsert: true });
        return { success: 'Forwarded image to friends' };
    } catch (err) {
        console.log(err);
        return { error: 'Error in forwardImageToFriends' };
    }
}
