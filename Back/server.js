require('dotenv').config();
import express from "express";
import { connect }from "mongoose";
import session from 'express-session';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import routes from './controller/routes';

import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo'
  
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;




connect(process.env.MONGO_DB, { useNewUrlParser: true ,useUnifiedTopology: true})
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
    cookie: {maxAge: 60000},
     store: MongoStore.create({mongoUrl: process.env.MONGO_DB})

}))
//Body Parser

app.use(passport.initialize());
app.use(passport.session());
passport.use(
    new GoogleStrategy(
      {
        clientID:  "773161337981-ub7ajbpha8uf9k8ivdr1ggjlobr74dro.apps.googleusercontent.com",
        clientSecret:  "i09j-SdVhA-UtfIbFswSQ_qS",
        callbackURL: "/auth/google/redirect"
      },
      (accessToken, refreshToken, profile, done)=> {
        // console.log("access token: ", accessToken);
        // console.log("refresh token: ", refreshToken);
        // console.log("profile: ", profile);
        done(null,profile)
      }
    )
  );
  app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
  }));


  app.get("/auth/google/redirect",passport.authenticate('google'),(req,res)=>{
    console.log( req.user.id ); 
    res.send(`hi there ${req.user.displayName}`);
  });
  passport.serializeUser((user, done) => {
    done(null, user);
  });


  passport.deserializeUser((user, done) => {
     
      done(null, user);
    
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

 