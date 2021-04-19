const mongoose = require("mongoose");


const User = mongoose.Schema(
    {
        googleId: String,
        name: String,
        email: String,
        visits: Number

    });
module.exports = mongoose.model("User", User)