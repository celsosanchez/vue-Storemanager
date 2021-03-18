require('dotenv').config();
import express from "express";
import { connect }from "mongoose";
import session from 'express-session';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import routes from './controller/routes';

import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo'
  
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

 