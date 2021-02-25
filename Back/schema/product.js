const mongoose = require("mongoose");

const product = mongoose.Schema(
    {
        Title: String,
        Body: String,
        Type: String,
        Add_Time: Date,




    });

module.exports = mongoose.model("Product", product)

