require("dotenv").config();
import express from "express";
import { connect } from "mongoose";
import session from "express-session";
import { urlencoded, json } from "body-parser";
import cors from "cors";
import routes from "./controller/routes";
import auth from "./lib/auth";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
// import log from './lib/logger'
const helmet = require("helmet");
// import credentials from './lib/credentials'
// const os = require('os')
// const cluster = require('cluster')
// const numCPUs = os.cpus().length;

//Create express object
const app = express();
app.use(cors());





// if (cluster.isMaster) {
//   log.info(`Master ${process.pid} is running`)
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker) => {
//     log.error(`worker ${worker.process.pid} just died`);
//     cluster.fork();
//   })
// } else { // every cpu will execute thefollowing
// console.log(`worker ${process.pid} is running`)
connect(process.env.MONGO_DB, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    // log.info("Connected to mongoDB");
    console.log("Connected to mongoDB");
  })
  .catch((e) => {
    // log.error("Error while DB connecting");
    // log.error(e);
    console.log("Error while DB connecting");
    console.log(e);
  });
//Port definition
// }
//allow from any origin

// session store definiton onto mongo
app.use(
  session({
    secret: process.env.SECRET,
    name: "sessionId",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_DB }),
  })
  );
  //Body Parser
  app.use(auth.initialize);
  app.use(auth.session);
  app.use(helmet());
  const urlencodedParser = urlencoded({
    extended: true,
  });
  app.use(urlencodedParser);
  app.use(cookieParser());
  app.use(json());
  // app.use(function (req, res, next) {
    //   if (!req.session.views) {
      //     req.session.views = {}
      //   }
      
      
      
      //   next()
      // })
      //Routing
      routes(app);
      
      const port = process.env.PORT || 3000;
      // app.listen(port, () => log.info(`Listening on port ${port}`));
      app.listen(port, () => console.log(`Listening on port ${port}`));