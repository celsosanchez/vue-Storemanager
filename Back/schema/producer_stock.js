const mongoose = require("mongoose");

const producer_stock = mongoose.Schema(
    {
        product_name: String,
        amount: Number,
        time_stamp: Date,
    });

module.exports = mongoose.model("producerStock", producer_stock)

