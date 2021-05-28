const mongoose = require("mongoose");
const Product = require("../schema/product");

const User = mongoose.Schema({
  // googleId: String,
  // name: String,
  // email: String,
  // visits: Number
  email: String,
  name: String,
  localistaion: [Number],
  normalStock: [String],
  actualStock: [String],
  shoppingCart: [String],
  expirationWarning: [String],
  expirationAlert: [String],
  shouldBuy: [String],
});
module.exports = mongoose.model("User", User);
