const mongoose = require("mongoose");

const User = mongoose.Schema({
  email: String,
  name: String,
  localistaion: [Number],
  desiredStock: [
    { Amount: Number, Image: String, Producer: String, Categories: String, name: String },
  ],
  shoppingList: [
    { Amount: Number, Image: String, Producer: String, Categories: String, name: String },
  ],
  paypalAccount:[String]
});
module.exports = mongoose.model("User", User);
