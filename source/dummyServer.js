const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CREATING THE PORT
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.append('Access-Control-Expose-Headers', '*');
    next();
});

// USING ROUTES
// app.use('/signup', signup);
// app.use('/login', login);
// app.use('/addfriend', addFriend);
// app.use('/posts', postImage);

app.get('/', (req, res) => {
    console.log('req recieved');
    res.send('helllo');
});

app.post('/signup', (req, res) => {
    console.log('demo sign up recieved');
    const num = Math.random();
    if (num <= 0.3) {
        const data = {
            username: req.body.username,
        };
        res.status(200).json(data);
    } else if (num <= 0.6) {
        res.status(500).json({ error: 'error in sign up' });
    } else {
        throw 'Unknown ERROR';
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('demo login recieved username: ', username, 'password: ', password);
    if (username == 'shahyash62' && password == '12345') {
        const token = {
            name: 'authentication',
            value: 'as36dc85vbiop01',
        };
        res.append(token.name, token.value).json({ status: 'g' });
        // res.json({ status: 'g' });
    } else {
        res.status(401).json({ errorCode: 901 });
    }
});

app.post('/messageS', (req, res) => {
    console.log('demo msgS recieved');
    const num = 0.25;
    if (num <= 0.3) {
        const data = {
            message: req.body.message,
            status: 'sent',
        };
        setTimeout(() => {
            console.log('Returned');
            res.status(200).json(data);
        }, 2000);
    } else if (num <= 0.6) {
        res.status(500).json({ error: 'error in messageS' });
    } else {
        throw 'Unknown ERROR';
    }
});

app.post('/messageR', (req, res) => {
    console.log('demo msgR recieved');
    const num = Math.random();
    const message = [
        'rhoncus',
        'in iaculis nunc',
        'dictum fusce ut placerat orci',
        'ut eu sem integer vitae justo eget magna',
        'blandit libero volutpat sed cras ornare arcu dui vivamus arcu felis bibendum ut',
        'aenean et tortor at risus viverra adipiscing at in tellus integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit',
    ];
    if (num <= 0.125) {
        const data = {
            message: message[0],
        };
        res.status(200).json(data);
    } else if (num <= 0.25) {
        const data = {
            message: message[1],
        };
        res.status(200).json(data);
    } else if (num <= 0.375) {
        const data = {
            message: message[2],
        };
        res.status(200).json(data);
    } else if (num <= 0.5) {
        const data = {
            message: message[3],
        };
        res.status(200).json(data);
    } else if (num <= 0.625) {
        const data = {
            message: message[4],
        };
        res.status(200).json(data);
    } else if (num <= 0.75) {
        const data = {
            message: message[5],
        };
        res.status(200).json(data);
    } else if (num <= 0.875) {
        res.status(500).json({ error: 'error in messageR' });
    } else {
        throw 'Unknown ERROR';
    }
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
