require('dotenv').config();
const jwtStrategy = require('passport-jwt').Strategy;
// const extractJwt = require('passport-jwt').ExtractJwt;
// const jwt = require('jsonwebtoken');
const utils = require('../misc/utils');

const User = require('../models/user');

const reconstructJWT = (header_payload, signature) => {
    return header_payload + '.' + signature;
}

const payloadFromCookie = reqHeaderCookieStr => {
    let list = utils.createCookieList(reqHeaderCookieStr);

    let signature = list['t_s'] || null;
    let headerPayload = list['t_hp'] || null;

    if (signature && headerPayload) {
        return reconstructJWT(headerPayload, signature);
    }

    return null;
}

const cookieExtractor = req => {
    let token = null;
    if (req && req.headers.cookie) {
        token = payloadFromCookie(req.headers.cookie);
    }
    return token;
};

module.exports = function(passport) {
    let opts = {};
    opts.jwtFromRequest = (req) => cookieExtractor(req); 
    //ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;
    // opts.issuer = '';
    // opts.audience = '';
    
    passport.use(new jwtStrategy(opts, async (jwtPayload, done) => {

        if (jwtPayload) {

            const user = await User.findById(jwtPayload.sub);

            if (!user) {
                console.log('User not found');
                return done(JSON.stringify({error: {message: 'User not found'}}), false, 'User not found.'); //done(null, false);
            }

            return done(null, user, 'User found.');
        }

        // jwt_payload is not provided
        console.log('Payload is not provieded.');
        return done(JSON.stringify({error: {message: 'Payload is not provieded.'}}), false, 'Payload is not provieded.');
 
    }));
};
