const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../schema/user')
import credentials from './credentials'
 
passport.use(
  new GoogleStrategy({
    clientID: credentials.google.clientID,
    clientSecret: credentials.google.clientSecret,
    callbackURL: '/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    // passport callback function
    //check if user already exists in our db with the given profile ID
    User.findOne({ googleId: profile.id }).then((currentUser) => {
      if (currentUser) {
        //if we already have a record with the given profile ID
        done(null, currentUser);
      } else {
        //if not, create a new user 
        new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
        }).save().then((newUser) => {
          done(null, newUser);
        });
      }
    })
  })
);
 
passport.serializeUser((user, done) => {
  console.log(`serialize`)
  // console.log(user)
  done(null, user._id);
});
 
passport.deserializeUser((_id, done) => {
  console.log(_id)
  User.findById(_id).then(user => {
    console.log(`deserialize`)
    console.log(user)
    done(null, user);
  });
});
 
module.exports = {
    initialize: passport.initialize(),
    session: passport.session(),
    setUser: (req, res, next) => {
     
      console.log(`export`)
      console.log(req.user)
      res.locals.user = req.user;
      return next();
  }
}