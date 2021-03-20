const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const LocalStrategy = require('passport-local').Strategy;


// passport.use(new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {

//     try {

//     } catch (err) {
//         return done(err);
//     }

// }))

module.exports = {
    initialize: passport.initialize(),
    session: passport.session(),
    setUser: (req, res, next) => {
        res.locals.user = req.user;
        return next();
    }

}