import express from 'express';
// import jwt from 'jsonwebtoken';
import { findUserData } from '../helper_functions/UserCheck';
import { getToken, authenticateUser } from '../helper_functions/AuthenticationHelpers';
import { PRIVATE_KEY } from '../helper_functions/config';
import { findUserMessageQueue, emptyQueue } from '../helper_functions/MessageQueueHelpers';

const router = express();

router.post('/', async (req, res) => {
    console.log(PRIVATE_KEY);
    const username = req.body.username;
    const password = req.body.password || '';
    const auth = await authenticateUser(username, password);
    if (!auth.errorCode) {
        const token = getToken(username);
        const [userData, userMessageQueue] = await Promise.all([findUserData(username), findUserMessageQueue(username)]);
        res.append('authentication', token).json({ userData, userMessageQueue });
        emptyQueue(userMessageQueue);
        return;
    } else {
        res.status(401).json({ errorCode: auth.errorCode });
    }
});

module.exports = router;
