import { UserDataInterface } from '../models/UserData';

const User = require('../models/UserData');
const UserCred = require('../models/UserCred');

export async function findUser(username: string): Promise<any> {
    return UserCred.findOne({ username }).then((user: any) => {
        return user;
    });
}

// TAKES USERNAME AND RETURNS USER OBJ FROM DATABASE
export async function findUserData(username: string): Promise<UserDataInterface> {
    return User.findOne({ username }).then((userData: any) => {
        return userData;
    });
}

// RETURNS TRUE IF THE USER IS ALREADY FRIENDS WITH THE GIVEN USERNAME
export function isAlreadyContactsOrReqPending(userData: UserDataInterface, contactUsername: string): boolean {
    const { globalContactList, sentPendingContactReqList } = userData;
    const matchFunc = (contact: any) => {
        if (typeof contact === 'string') return contact === contactUsername;
        return contact.username === contactUsername;
    };
    return globalContactList.some(matchFunc) || sentPendingContactReqList.some(matchFunc);
}

export function userInList(username: string, inputList: Array<any>) {
    if (inputList.some((obj: any) => username === obj.username)) {
        return true;
    } else {
        return false;
    }
}
