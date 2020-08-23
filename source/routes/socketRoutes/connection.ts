import { verifyToken } from '../../helper_functions/AuthenticationHelpers';
import { findUserMessageQueue } from '../../helper_functions/MessageQueueHelpers';

const userToSocketMap: UserToSocketMap = {};
const socketToUserMap: SocketToUserMap = {};

export function makeChatServer(io: SocketIO.Server): void {
    const chatSocket = io.of('/chat');
    chatSocket.use(authenticationSocketMiddleware);
    connectSocket(chatSocket);
    // io.to('aisdij').emit('hello', 'tmkc');
}

function connectSocket(nameSpace: SocketIO.Namespace): void {
    nameSpace.on('connect', (socket) => {
        const id = socket.handshake.query.username;
        userToSocketMap[id] = socket.id;
        socketToUserMap[socket.id] = id;
        console.log('userSocket', userToSocketMap, 'socketUser', socketToUserMap);
        socket.on('disconnect', (reason) => socketDisconnected(reason, socket));
        socket.on('forwardMessage', forwardMessage);
    });

    async function forwardMessage(data: any, callback: Function) {
        const { username, message, toUsername } = data;
        try {
            if (typeof data === 'object' && toUsername && userToSocketMap[toUsername]) {
                const dataToForward = {
                    fromUsername: username,
                    message: message,
                };
                nameSpace.to(userToSocketMap[toUsername]).emit('recieveMessage', dataToForward);
            } else {
                const messageQueue = await findUserMessageQueue(toUsername);
                console.log(messageQueue);
                if (messageQueue.queue && messageQueue.queue.has(username)) {
                    const currentQueue = messageQueue.queue.get(username);
                    if (typeof currentQueue !== 'undefined') messageQueue.queue.set(data.username, [...currentQueue, message]);
                    messageQueue.save().then((queue: any) => console.log('SAVED IN Q', queue));
                } else {
                    messageQueue.set(`queue.${data.username}`, [data.message]);
                    messageQueue.save().then((queue: any) => console.log('SAVED IN Q', queue));
                }
            }
        } catch (error) {
            console.log(error);
            return callback('failed');
        }
        console.log(data);
        return callback('message sent'); // Come up with a status code for this
    }

    function socketDisconnected(reason: string = 'NA', socket: SocketIO.Socket) {
        console.log(reason);
        const username = socketToUserMap[socket.id];
        delete socketToUserMap[socket.id];
        delete userToSocketMap[username];
        console.log('userSocketDis', userToSocketMap, 'socketUserDis', socketToUserMap);
    }
}

export async function authenticationSocketMiddleware(socket: SocketIO.Socket, next: (err?: any) => void) {
    console.log('socket middleware called');
    const token = socket.handshake.query.token;
    const username = await verifyToken(token);
    if (username === socket.handshake.query.username) return next();
    return next(new Error('authentication error'));
}
interface UserToSocketMap {
    [username: string]: string;
}
interface SocketToUserMap {
    [socketId: string]: string;
}

// Socket Connection
// get socket id and username create 2 reverse maps to store them in db and in memory

// Socket disconnection
// close socket and delete id and username from reverse maps and memory
