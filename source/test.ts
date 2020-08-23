import express from 'express';
import path from 'path';
import { Socket } from 'socket.io';
import { PassThrough } from 'stream';

const app = express();
const http = require('http').createServer(app);

// import socket.io
const io = require('socket.io')(http);
const PORT = process.env.PORT || 5000;

// LIST OF CONNECTED SOCKETS | HAVE TO STORE IN CACHE OR A DB
const CONNECTED_SOCKETS: {
    [username: string]: {
        socketID: string;
    };
} = {};

// HARCODED USER LIST | HAVE TO FETCH THIS FROM THE DB
const USERS: string[] = ['shahyash62', 'evilgovind', 'xero', 'ajoonkinagi'];

// LIST OF MESSAGES THAT NEED TO BE DELIVERED AFTER THE USER IS ONLINE
const TBD: {
    [username: string]: {
        message: string[];
    };
} = {};

http.listen(PORT, () => console.log(`server running on port ${PORT}`));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

io.on('connection', (socket: Socket) => {
    console.log(`user connected on ${socket.id}`);

    // PATH TO SAVE THE USERNAME IN THE CONNECTED_SOCKETS OBJECT
    socket.on('save username', (username: string) => {
        username = username.substring(1, username.length);
        CONNECTED_SOCKETS[username] = { socketID: socket.id };
        if (username in TBD) {
            for (let msg of TBD[username].message) {
                io.to(socket.id).emit('chat message', msg);
            }
            delete TBD[username];
            // console.log(TBD);
        }
        console.log(TBD);
        console.log(CONNECTED_SOCKETS);
    });

    // PATH TO SEND A CHAT MESSAGE
    socket.on('chat message', data => {
        let username = data.receiver_username;
        console.log(data);
        console.log(CONNECTED_SOCKETS);

        if (username in CONNECTED_SOCKETS) {
            io.to(CONNECTED_SOCKETS[username].socketID).emit('chat message', data.message);
        } else {
            if (!(username in TBD)) {
                TBD[username] = {
                    message: [data.message]
                };
            } else {
                let messageList = TBD[username].message;
                messageList.push(data.message);
                TBD[username] = {
                    message: messageList
                };
            }
        }
        // console.log(TBD);
    });

    // CHECK IF USER IS TYPING
    socket.on('typing', (username: string) => {
        console.log(`${username} typing`);
        socket.broadcast.emit('typing', username);
    });
    // console.log(CONNECTED_SOCKETS);
    socket.on('disconnect', () => {
        console.log('user disconneted');
        for (let user in CONNECTED_SOCKETS) {
            if (CONNECTED_SOCKETS[user].socketID === socket.id) {
                delete CONNECTED_SOCKETS[user];
            }
        }
        console.log(CONNECTED_SOCKETS);
    });
});
