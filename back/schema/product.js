const mongoose = require("mongoose");

const product = mongoose.Schema({
  //original data
  labels_fr: String,
  carbohydrates_100g: Number,
  salt_100g: Number,
  energy_100g: Number,
  image_nutrition_small_url: String,
  ingredients_text: String,
  additives_tags: String,
  origins: String,
  packaging_tags: String,
  image_small_url: String,
  cities_tags: String,
  nova_group: Number,
  main_category: String,
  labels_tags: String,
  additives_n: Number,
  ingredients_from_palm_oil_n: Number,
  first_packaging_code_geo: [Number],
  carbon_footprint_from_meat_or_fish_100g: String,
  product_name: String,
  image_ingredients_small_url: String,
  categories_fr: String,
  ingredients_that_may_be_from_palm_oil_n: Number,
  packaging: String,
  additives_fr: String,
  url: String,
  traces_fr: String,
  pnns_groups_2: String,
  main_category_fr: String,
  pnns_groups_1: String,
  brands: String,
  image_url: String,
  quantity: String,
  // added data
  production_datetime: Date,
  expiration_datetime: Date,
  location: String,
  duration_in_days: Number,
  expirationIn: {
    type: Number,
    default: function () {
      return Math.round((this.expiration_datetime - Date.now()) / 86400000);
    },
  },
});

module.exports = mongoose.model("Product", product);
