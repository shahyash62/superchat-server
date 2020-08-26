import express from 'express';
// import jwt from 'jsonwebtoken';
import { findUserData } from '../helper_functions/UserCheck';
import { getToken, authenticateUser } from '../helper_functions/AuthenticationHelpers';
import { findUserMessageQueue, emptyQueue } from '../helper_functions/MessageQueueHelpers';

const router = express();

router.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password || '';
    try {
        const auth = await authenticateUser(username, password);
        if (!auth.errorCode) {
            const token = getToken(username);
            const [userData, userMessageQueue] = await Promise.all([findUserData(username), findUserMessageQueue(username)]);
            res.append('authentication', token).json({ userData, userMessageQueue });
            emptyQueue(userMessageQueue);
            return;
        } else {
            return res.status(401).json({ errorCode: auth.errorCode });
        }
    } catch (error) {
        console.log('login error: ', error);
        return res.status(500).end();
    }
});

module.exports = router;
