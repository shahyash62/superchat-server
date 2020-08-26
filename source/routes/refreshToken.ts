import express from 'express';
import { refreshToken } from '../helper_functions/AuthenticationHelpers';
import { findUserData } from '../helper_functions/UserCheck';
import { findUserMessageQueue, emptyQueue } from '../helper_functions/MessageQueueHelpers';

const router = express();

router.post('/', async (req, res) => {
    const token: unknown = req.headers.authentication;
    const username: unknown = req.body.username;
    try {
        let newToken;
        if (token && username && typeof token === 'string' && typeof username === 'string') {
            newToken = await refreshToken(token, username);
            console.log('Refreshed Token: ', newToken);
            if (newToken && typeof newToken === 'string') {
                const [userData, userMessageQueue] = await Promise.all([findUserData(username), findUserMessageQueue(username)]);
                res.append('authentication', newToken).json({ userData, userMessageQueue });
                emptyQueue(userMessageQueue);
                return;
            } else {
                return res.status(401).end();
            }
        }
    } catch (error) {
        console.log('login error: ', error);
        return res.status(500).end();
    }
});

module.exports = router;
