require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors'); // allows us to any domain access this api
const passport = require('passport');
const mongoose = require('mongoose');
const app = express();

mongoose
    .connect(process.env.DB_HOST, 
    { 
        useCreateIndex: true,
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('DB has connected.'))
    .catch(() => console.log('DB connection error.'));


const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;

const genFakeJsonData = require('./routes/fakeData');
const auth = require('./routes/api/auth');
const users = require('./routes/api/users');

// CORS Middleware
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/data', genFakeJsonData);
app.use('/api/auth', auth);
app.use('/api/users', passport.authenticate('jwt', {session: false}), users);

// app.use(errorHandler);

app.get('/*', (req, res) => {
    res.send(path.join(__dirname));
});

app.listen(port, () => console.log(`Server started on port ${port}`));

