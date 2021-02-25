const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const routes = require('./controller/routes');

var cors = require('cors');


mongoose
    .connect("mongodb+srv://admin:admin123@cluster0.4i7l5.mongodb.net/store?retryWrites=true&w=majority", { useNewUrlParser: true ,useUnifiedTopology: true})
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
const urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());

//Routing
routes(app)

//Port definition
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`));

 