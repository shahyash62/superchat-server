import express from 'express';
import { isAlreadyContactsOrReqPending, userInList, findUserData } from '../../helper_functions/UserCheck';
import { AuthenticateUser } from '../../authentication/AuthenticateUser';
import { UserDataInterface } from '../../models/UserData';
import { Profile } from '../../data_types/dataTypes';
const router = express();

// SHOULD NOT BE ABLE TO MAKE MULTIPLE REQ
router.put('/sendcontactreq', AuthenticateUser, (req, res) => {
    const username: string = req.body.username;
    const contactUsername: string = req.body.contactUsername;
    const profile: Profile = req.body.profile;
    console.log('initfriendreq body: ', req.body);
    findUserData(username).then((user: UserDataInterface) => {
        // CASES
        // Friend already added
        // Request already sent
        findUserData(contactUsername).then(async (contact: UserDataInterface) => {
            if (user && contact) {
                if (!isAlreadyContactsOrReqPending(user, contactUsername)) {
                    const sentPendingReq = {
                        username: contactUsername,
                        profile,
                    };
                    const receivedPendingReq = {
                        username,
                    };
                    try {
                        user.sentPendingContactReqList.unshift(sentPendingReq);
                        contact.receivedPendingContactReqList.unshift(receivedPendingReq);
                        await contact.save();
                        user.save()
                            .then((user: UserDataInterface) => res.json({ data: user.sentPendingContactReqList }))
                            .catch((err: Object) => {
                                console.log(err);
                                res.status(500).json({ errorCode: 500 });
                            });
                    } catch (err) {
                        console.log(err);
                        res.status(500).json({ errorCode: 500 });
                    }
                } else {
                    res.status(400).json({ errorCode: 920 });
                }
            } else {
                res.status(400).json({ errorCode: 900 });
            }
        });
    });
});

router.put('/acceptcontactreq', AuthenticateUser, (req, res) => {
    const username = req.body.username;
    const contactUsername = req.body.contactUsername;
    // const nickname = req.body.nickname;
    const profile: Profile = req.body.profile;
    console.log('acceptcontactreq BODY: ', req.body);
    try {
        findUserData(username).then((user: UserDataInterface) => {
            findUserData(contactUsername).then((contact: UserDataInterface) => {
                // console.log(`${user} : ${contact}`);

                if (user && contact) {
                    const newContact = {
                        username: contactUsername,
                        // nickname: nickname || contactUsername,
                    };

                    // ADDING FRIEND TO THE LIST OF THE USER ACCEPTING THE INCOMING FRIEND REQ
                    user.globalContactList.unshift({ username: contactUsername });
                    user[profile].contactList.unshift(newContact);
                    let index = user.receivedPendingContactReqList.findIndex((friendReq: any) => friendReq.username === contactUsername);
                    user.receivedPendingContactReqList.splice(index, 1);

                    // // ADDING FRIEND TO THE USER WHO SENT THE INIT FRIEND REQ
                    contact.globalContactList.unshift({ username });
                    index = contact.sentPendingContactReqList.findIndex((contactReq: any) => contactReq.username === username);
                    const sentContactReq = contact.sentPendingContactReqList.splice(index, 1)[0];
                    console.log(sentContactReq);

                    contact[sentContactReq.profile].contactList.unshift({
                        username: sentContactReq.username,
                        // nickname: sentFriendReq.username,
                    });
                    user.save()
                        .then(() => {
                            contact.save().then(() => {
                                res.json({
                                    receivedPendingContactReqList: user.receivedPendingContactReqList,
                                    globalContactList: user.globalContactList,
                                    [profile]: user[profile],
                                });
                            });
                        })
                        .catch((err: any) => {
                            res.status(500).json({ errorCode: 500 });
                        });
                } else {
                    res.status(400).json({ errorCode: 900 });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ errorCode: 500 });
    }
});

module.exports = router;
