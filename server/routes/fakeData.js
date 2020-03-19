const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const crypto = require('crypto');
const { query} = require('express-validator');

function genFakeUsers(count) {
    const users = [];
    const salt = bcrypt.genSaltSync(10);
    const hashedPw = bcrypt.hashSync('test123', salt);

    for (var i = 1; i <= count; i++) {

        const rand = crypto.randomBytes(3).toString('hex');
        // const id = i;
        const username = `User${i}`;
        const email = `test${i}and${rand}@test.com`;
        
        users.push(
            { 
                firstName: username,
                lastName: rand,
                email: email,
                password: hashedPw 
            }
        );
    }

    return users;
}

router.get('/uploadDB', [ query('count').notEmpty().toInt() ], async (req, res, next) => {

    const count = req.query.count || 1000;
    const userdb = genFakeUsers(count);

    userdb.forEach(async (user) => {
        const newUser = new User({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            passwordHash: user.password
        });
    
        await newUser.save();
    });
    
    res.status(200).json({data: {
        message: 'DB has been uploaded.'
    }});
});

router.get('/fake', [ query('count').notEmpty().toInt() ], (req, res, next) => {

    const count = req.query.count || 1000;
    const userdb = genFakeUsers(count);

    res.status(200).json({users: userdb});
});

module.exports = router;