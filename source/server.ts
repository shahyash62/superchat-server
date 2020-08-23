import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import http from 'http';
import https from 'https';
import fs from 'fs';
import SocketIO from 'socket.io';
import { MONGO_URI } from './helper_functions/config';
import { makeChatServer } from './routes/socketRoutes/connection';

// IMPORTING CERTS
var options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
};

dotenv.config();
// IMPORTING ROUTES
const signup = require('./routes/signup');
const login = require('./routes/login');
const addContact = require('./routes/profile/addContact');
const postImage = require('./routes/posts/postimage');

// Socket Initialization
const app = express();
const server = http.createServer(app);
const secureServer = https.createServer(options, app);
const io = SocketIO(server);
makeChatServer(io);

// CREATING THE PORT
const port = process.env.PORT || 5000;

// CONNECTION TO MONGODB
mongoose
    .connect(MONGO_URI, { dbName: 'Zen', useNewUrlParser: true })
    .then(() => console.log('db connected'))
    .catch((err) => console.log(`error while connecting to db: ${err}`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS CONTROL
app.use(function (req, res, next) {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.append('Access-Control-Expose-Headers', '*');
    res.append('Access-Control-Allow-Methods', '*');
    next();
});

// USING ROUTES
app.use('/signup', signup);
app.use('/login', login);
app.use('/addcontact', addContact);
// app.use('/posts', postImage);
app.get('/', (req, res) => {
    console.log('req recieved');
    res.send('helllo');
});

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});

secureServer.listen(443, () => {
    console.log(`https server running on port 443`);
});
