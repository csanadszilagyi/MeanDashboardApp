const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const _ = require('lodash');

function genUsersData() {
    const users = [];
    const salt = bcrypt.genSaltSync(10);
    const hashedPw = bcrypt.hashSync('test123', salt);

    for (var i = 1; i <= 1000; i++) {

        const id = i;
        const username = 'User ' + i;
        const email = 'test'+i+'@test.com';
        
        users.push(
            { 
                id: id,
                firstName: username,
                lastName: username,
                email: email,
                password: hashedPw 
            }
        );
    }

    return users;
}

router.get('/allUsers', (req, res, next) => {
    const userdb = genUsersData();
    res.json({users: userdb});
});

module.exports = router;