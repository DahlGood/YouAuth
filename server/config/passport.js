const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const passport = require("passport");
const User = mongoose.model("users");
require('dotenv').config();
const envVars = process.env;
const { MONGO_URI, PORT, SECRET_KEY } = envVars;

//http://www.passportjs.org/packages/passport-jwt/
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt.jwt_payload.id).then(user => {
                if(user) {
                    return done(null, user);
                }
                return done(null, false);
            }).catch(err => console.log(err));
        })
    );
};