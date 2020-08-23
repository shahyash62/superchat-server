import mongoose, { Document } from 'mongoose';
import { Profile } from '../data_types/dataTypes';
const schema = mongoose.Schema;

export interface UserDataInterface extends Document {
    username: string;
    globalContactList: [{ username: string }];
    receivedPendingContactReqList: [{ username: string }];
    sentPendingContactReqList: [
        {
            username: string;
            profile: Profile;
        }
    ];
    red: {
        nickname: string;
        status: string;
        displayPicture: string;
        imagePostList: Array<string>;
        contactList: [{ username: string }];
    };
    blue: {
        nickname: string;
        status: string;
        displayPicture: string;
        imagePostList: Array<string>;
        contactList: [{ username: string }];
    };
    green: {
        nickname: string;
        status: string;
        displayPicture: string;
        imagePostList: Array<string>;
        contactList: [{ username: string }];
    };
}

const UserDataSchema = new schema({
    username: {
        type: String,
        required: true,
    },
    globalContactList: [
        {
            username: {
                type: String,
                required: true,
            },
        },
    ],
    receivedPendingContactReqList: [
        {
            username: {
                type: String,
                required: true,
            },
        },
    ],
    sentPendingContactReqList: [
        {
            username: {
                type: String,
                required: true,
            },
            profile: {
                type: String,
                required: true,
            },
        },
    ],
    red: {
        nickname: {
            type: String,
            required: true,
        },
        status: {
            type: String,
        },
        displayPicture: {
            type: String,
            required: true,
            default: 'none',
        },
        imagePostList: [String],
        contactList: [
            {
                username: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    blue: {
        nickname: {
            type: String,
            required: true,
        },
        status: {
            type: String,
        },
        displayPicture: {
            type: String,
            required: true,
            default: 'none',
        },
        imagePostList: [String],
        contactList: [
            {
                username: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    green: {
        nickname: {
            type: String,
            required: true,
        },
        status: {
            type: String,
        },
        displayPicture: {
            type: String,
            required: true,
            default: 'none',
        },
        imagePostList: [String],
        contactList: [
            {
                username: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
});

const User = mongoose.model<UserDataInterface>('UserProfile', UserDataSchema, 'UserProfiles');
module.exports = User;
