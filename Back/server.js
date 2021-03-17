require('dotenv').config();
import express from "express";
import { connect } from "mongoose";
import { urlencoded, json } from 'body-parser';
import routes from './controller/routes';
import cors from 'cors';

 
const db = process.env.MONGO_DB;
 
connect(db, { useNewUrlParser: true ,useUnifiedTopology: true})
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

//Body Parser
const urlencodedParser = urlencoded({
    extended: true
});
app.use(urlencodedParser);
app.use(json());

//Routing
routes(app)

//Port definition
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`));

 