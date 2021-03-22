require('dotenv').config();
import express from "express";
import { connect } from "mongoose";
import session from 'express-session';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import routes from './controller/routes';
import credentials from './lib/credentials'

import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo'

const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./schema/user')


connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((e) => {
    console.log("Error while DB connecting");
    console.log(e);
  });

//Create an express object named app
const app = express();
//allow from any origin
app.use(cors());
// session store definiton onto mongo
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 60000 },
  store: MongoStore.create({ mongoUrl: process.env.MONGO_DB })

}))
//Body Parser

app.use(passport.initialize());
app.use(passport.session());
 
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






app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));


app.get("/auth/google/redirect", passport.authenticate('google'), async (req, res) => {
  
  const user = await User.findById(req.user);
  res.send(`Hi there ${user.name}`)
}); 


passport.serializeUser((user, done) => {
  done(null, user.id);
});
 
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});





const urlencodedParser = urlencoded({
  extended: true
});
app.use(urlencodedParser);
app.use(cookieParser())
app.use(json());

//Routing
routes(app)

//Port definition
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`));

