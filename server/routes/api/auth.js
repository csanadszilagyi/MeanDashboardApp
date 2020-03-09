require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config/settings');
const router = express.Router();
const User = require('../../models/user');

/**
 * @return user, if found by email and password hashes are equal
 * @param email
 * @param password 
 */
async function attemptLogin(email, password) {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
        return user.toObject();
    }
    return null;
}

const createToken = payload => 
    jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: config.JWT_TOKEN_EXPIRATION
    });

const verifyToken = token =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) =>
      decode !== undefined ? resolve(decode) : reject(err)
    )
);

const createHeaderSignature = jwtToken => {
    const splitted = jwtToken.split('.');
    return {
        headerPayload: splitted[0] + '.' + splitted[1],
            signature: splitted[2]
    };
}

// 30 min - in MS
const COOKIE_PAYLOAD_TOKEN_AGE = 600000; // 1 min = 60000 Ms

/* 
 * GOAL:
 * Jwt token stored in cookies in two parts: first part contains the header.payload, second contains the signature.
 * If the jwt expires (checked on the backend with each requests on the jwt-protected routes), 
 * the server sending a response to the client to ask the user
 * to retype his password. If correct, new payload will be created for 10 minutes. 
 * The payload cookie's lifetime is 1 hour.
 * NOTE: It is not implemented yet!
 */
router.post('/refreshtoken', async (req, res, next) => {
    
});

router.post('/login', async (req, res, next) => {
    
    const email = req.body.data.email;
    const password = req.body.data.password;

    const user = await attemptLogin(email, password);

    if (!user) {
        const status = 401;
        const message = 'Incorrect email or password';
        return res.status(status).json({
            status,
            message 
        });
    }

    const accessToken = createToken({
        user: {
            id: user.id,
            email: user.email
        },
        iss: "dashboard-app",
        sub: user.id
    });


    const {headerPayload, signature} = createHeaderSignature(accessToken);

    // t_hp = token_headerPayload
    // t_s = token_signature
    // 30 min, given in Milli Seconds
    res.cookie('t_hp', headerPayload, {expires: true, maxAge: COOKIE_PAYLOAD_TOKEN_AGE}); // secure, 30 min life {secure: true, expires: true}
    res.cookie('t_s', signature, {httpOnly: true}); // secure, httpOnly, session life
    
    return res.status(200).json({
        data: {
            user: {
                id: user.id,
                email: user.email
            },
            token: accessToken
        }
    }); 
    
});

router.post('/register', async (req, res, next) => {

    const email = req.body.data.email;
    const user = await User.findOne({ email });

    if (user) {
       return res.status(409)
       .json({
            message: `Profile with ${email} already exists.`,
            status: 409
        });
    }

    const pwHash = bcrypt.hashSync(req.body.data.password, 10);

    const newUser = new User({
        firstName: req.body.data.firstName,
        lastName: req.body.data.lastName,
        email: email,
        passwordHash: pwHash
    });

    newUser.save()
        .then((result) => {
            return res
                .status(201)
                .json({
                    data: {
                        message: 'Registration was successfull.'
                    }
                })
        })
        .catch(error => {
            return res
                .status(400)
                .json({
                    message: error
                });
        });
});


router.post('/logout', (req, res, next) => {
    // t_hp = token_headerPayload
    // t_s = token_signature
    return res
        .clearCookie('t_hp')
        .clearCookie('t_s')
        .cookie('t_hp', '', {expires: new Date(0)})
        .cookie('t_s', '', {expires: new Date(0)})
        .status(200).json({
            data: {
                message: 'Logged out.'
            }
        });
});

module.exports = router;