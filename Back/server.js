require('dotenv').config();
import express from "express";
import { connect } from "mongoose";
import session from 'express-session';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import routes from './controller/routes';
import auth from './lib/auth';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo'
import log from './lib/logger'
import credentials from './lib/credentials'


connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    log.info("Connected to mongoDB"); 
  })
  .catch((e) => {
    log.error("Error while DB connecting");
    log.error(e);
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
app.use(auth.initialize);
app.use(auth.session);

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
app.listen(port, () => log.info(`Listening on port ${port}`));

