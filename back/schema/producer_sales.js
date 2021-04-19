const mongoose = require("mongoose");

const producer_sales = mongoose.Schema(
    {
        product_name: String,
        buyer: String,
        sent: Boolean,
        time_stamp: Date
    });

module.exports = mongoose.model("producerSales", producer_sales)

