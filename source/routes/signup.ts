import express from 'express';
import bcrypt from 'bcryptjs';
import { findUser } from '../helper_functions/UserCheck';
import { getToken } from '../helper_functions/AuthenticationHelpers';
const UserCred = require('../models/UserCred');
const UserData = require('../models/UserData');
const MessageQueue = require('../models/MessageQueue');
const router = express();

// router.get('/', (req, res) => {
//     console.log('route works');

// })

// TODO: MAKE THIS AN AUTHORISED ROUTE AND RETURN A TOKEN WHICH WILL BE USED
// BY THE OTHER SERVICES
router.post('/', (req, res) => {
    console.log('sign up route works');
    const username = req.body.username;
    const password = req.body.password || '';

    findUser(username).then((user: any) => {
        // Password is hashed using bcryptjs before storing it in the database
        if (!user) {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                const newUserCredentials = new UserCred({
                    username,
                    password: hashedPassword,
                });
                console.log(newUserCredentials);
                const newUser = new UserData({
                    username,
                    red: {
                        nickname: username,
                    },
                    blue: {
                        nickname: username,
                    },
                    green: {
                        nickname: username,
                    },
                });
                const newUserMessageQueue = new MessageQueue({
                    username,
                });
                console.log(newUserCredentials);
                newUserCredentials
                    .save()
                    // WHAT HAPPENS IF ONLY USER CRED IS CREATED AND NO PROFILES?
                    .then((user: any) => {
                        try {
                            newUser.save();
                            newUserMessageQueue.save();
                        } catch (err) {
                            console.log(`error: ${err}`);
                        }
                        const token = getToken(username);
                        res.header('authentication').json({ token });
                    })
                    .catch((err: any) => {
                        console.log(err);
                        //Server error
                        res.status(500).json({ error: 500 });
                    });
            });
        } else {
            //User already exits
            res.status(400).json({ error: 902 });
        }
    });
});

module.exports = router;
