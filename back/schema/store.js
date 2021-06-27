const mongoose = require("mongoose");

const Store = mongoose.Schema({
  storeName: String,
  Shelves: [
    {
      Shelf: String,
      Items: [
        {
          name: String,
          Amount: Number,
          Image: String,
          ids: [String],
        },
      ],
    },
  ],
});
module.exports = mongoose.model("Store", Store);
