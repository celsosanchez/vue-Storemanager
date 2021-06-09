const mongoose = require("mongoose");
// const Product = require("../schema/product");

const User = mongoose.Schema({
  // googleId: String,
  // name: String,
  // email: String,
  // visits: Number
  email: String,
  name: String,
  localistaion: [Number],
  desiredStock: [
    { Amount: Number, Image: String, Producer: String, name: String },
  ],
  shoppingList: [
    { Amount: Number, Image: String, Producer: String, name: String },
  ],
  actualStock: [String],
  shoppingCart: [String],
  expirationWarning: [String],
  expirationAlert: [String],
  shouldBuy: [String],
});
module.exports = mongoose.model("User", User);
