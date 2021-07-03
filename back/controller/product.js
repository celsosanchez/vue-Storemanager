const Product = require("../schema/product");
// const ProducerStockEntry = require("../schema/producer_stock");
const store = require("../schema/store");

const axios = require("axios").default;
// const { json } = require("body-parser");
// const e = require("express");
// const User = require("../schema/user");
// const log = require("../lib/logger");

async function addProducts(req, res) {
  const { product, duration_in_days, amount } = req.body;
  if (!product || !duration_in_days || !amount) {
    return res.status(400).json({
      text: "invalid request",
    });
  }
  var productData;
  try {
    await axios
      .get(
        `https://data.opendatasoft.com/api/records/1.0/search/?dataset=open-food-facts-products%40public&q=product_name%3A${product}&rows=10000&facet=creator&facet=created_datetime&facet=packaging_tags&facet=brands_tags&facet=categories_tags&facet=categories_fr&facet=origins_tags&facet=manufacturing_places_tags&facet=labels_tags&facet=labels_fr&facet=cities_tags&facet=countries_tags&facet=allergens&facet=traces_tags&facet=additives_n&facet=additives_tags&facet=ingredients_from_palm_oil_n&facet=ingredients_that_may_be_from_palm_oil_n&facet=nutrition_grade_fr&facet=pnns_groups_1&facet=pnns_groups_2&facet=main_category&facet=energy_100g&facet=fat_100g&facet=sugars_100g&refine.origins_tags=france`
      )
      .then((res) => {
        productData = {
          labels_fr: res.data.records[0].fields.labels_fr,
          carbohydrates_100g: res.data.records[0].fields.carbohydrates_100g,
          salt_100g: res.data.records[0].fields.salt_100g,
          energy_100g: res.data.records[0].fields.energy_100g,
          image_nutrition_small_url:
            res.data.records[0].fields.image_nutrition_small_url,
          ingredients_text: res.data.records[0].fields.ingredients_text,
          additives_tags: res.data.records[0].fields.additives_tags,
          origins: res.data.records[0].fields.origins,
          packaging_tags: res.data.records[0].fields.packaging_tags,
          image_small_url: res.data.records[0].fields.image_small_url,
          cities_tags: res.data.records[0].fields.cities_tags,
          nova_group: res.data.records[0].fields.nova_group,
          main_category: res.data.records[0].fields.main_category,
          labels_tags: res.data.records[0].fields.labels_tags,
          additives_n: res.data.records[0].fields.additives_n,
          ingredients_from_palm_oil_n:
            res.data.records[0].fields.ingredients_from_palm_oil_n,
          first_packaging_code_geo:
            res.data.records[0].fields.first_packaging_code_geo,
          carbon_footprint_from_meat_or_fish_100g:
            res.data.records[0].fields.carbon_footprint_from_meat_or_fish_100g,
          product_name: res.data.records[0].fields.product_name,
          image_ingredients_small_url:
            res.data.records[0].fields.image_ingredients_small_url,
          categories_fr: res.data.records[0].fields.categories_fr,
          categories_tags: res.data.records[0].fields.categories_tags,
          ingredients_that_may_be_from_palm_oil_n:
            res.data.records[0].fields.ingredients_that_may_be_from_palm_oil_n,
          packaging: res.data.records[0].fields.packaging,
          additives_fr: res.data.records[0].fields.additives_fr,
          url: res.data.records[0].fields.url,
          traces_fr: res.data.records[0].fields.traces_fr,
          pnns_groups_2: res.data.records[0].fields.pnns_groups_2,
          main_category_fr: res.data.records[0].fields.main_category_fr,
          pnns_groups_1: res.data.records[0].fields.pnns_groups_1,
          brands: res.data.records[0].fields.brands,
          image_url: res.data.records[0].fields.image_url,
          quantity: res.data.records[0].fields.quantity,
          production_datetime: Date.now(),
          availableToBuyerAt: Date.now(),
          expiration_datetime: new Date(
            Date.now() + duration_in_days * 86400000
          ),
          location: "Producer",
        };
      })
      .then(async function () {
        var ids = [];
        try {
          //adding to Producer_Stock
          const prod_stock = {
            brands: productData.brands,
            product_name: productData.product_name,
            amount: amount,
            where: "Produced",
            time_stamp: productData.production_datetime,
          };
          // const stock = new ProducerStockEntry(prod_stock);
          // stock.save();
          //adding to Product
          for (let index = 0; index < amount; index++) {
            const Data = new Product(productData);
            await Data.save();
            ids.push(Data._id);
          }
          return res.status(200).json({
            text: `products added with ids: `,
            ids: ids,
          });
        } catch (error) {
          // log.error(error)
          console.log(error);
          return res.status(500).json({ error });
        }
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}

async function getProducts(req, res) {
  try {
    // console.log(req.session);
    // console.log(req.user);
    const found = await Product.find(req.body);
    return res.status(200).json({
      count: found.length,
      found,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function rmProducerEntry(req, res) {
  const { productName, amount, location } = req.body;
  if (!productName || !amount || !location) {
    return res.status(400).json({
      text: "invalid request ",
    });
  }
  var count = 0;
  try {
    for (let index = 0; index < amount; index++) {
      const found = await Product.findOneAndDelete({
        product_name: productName,
        location: location,
      });
      if (found) {
        count += 1;
      } else {
        break;
      }
    }
    return res.status(200).json({
      text: `deleted ${count} of ${productName} from ${location}`,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
}

async function consumerBuyFromProducer(req, res) {
  const { productId, buyer, buyerLocation, productLocation } = req.body.data;
  let time, geoLocation,distance;
  if (productLocation.length == 0) {
    geoLocation = [48.1147, -1.6794];
  } else {
    geoLocation = productLocation;
  }
  try {
    await axios
      .post(
        "http://www.mapquestapi.com/directions/v2/routematrix?key=RGptLi1WllF7egmD9YAzMwR6s37hXoaF",
        {
          locations: [
            {
              latLng: {
                lat: buyerLocation[0],
                lng: buyerLocation[1],
              },
            },
            {
              latLng: {
                lat: geoLocation[0],
                lng: geoLocation[1],
              },
            },
          ],
        }
      )
      .then((res) => {
        time = res.data.time[1];
        distance =res.data.distance[1];
      })
      .catch((err) => {
        console.log(err);
      });
    let timeOfBuy = Date.now();
    let available = timeOfBuy + time * 1000;
    await Product.findOneAndUpdate(
      { _id: productId },
      {
        location: buyer,
        availableToBuyerAt: available,
        timeOfBuy: timeOfBuy,
        deliveryDistance: distance
      },
      (err, doc) => {
        if (err) console.log(`error: ${err}`);
        return res.send(doc);
      }
    );
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function consumerBuyFromStore(req, res) {
  const { productId, buyer, location } = req.body.data;
  let rdoc;
  try {
    let timeOfBuy = Date.now();
    await Product.findOneAndUpdate(
      { _id: productId },
      {
        location: buyer,
        timeOfBuy: timeOfBuy,
      },
      (err, doc) => {
        if (err) console.log(`error: ${err}`);
        rdoc = doc;
      }
    );
    var list = [];
    axios
      .get(`http://localhost:3000/store`, {
        params: { storeName: location },
      })
      .then((res) => {
        if (res.data.found[0]) list = res.data.found[0].Shelves;
        else this.list = [];

        list.forEach((x, index) => {
          list[index].Items.forEach((el, i) => {
            if (el.name == rdoc.product_name) {
              if (el.Amount > 1) {
                el.Amount -= 1;
              } else {
                list[index].Items.splice(i, 1);
              }
            }
          });
        });
        axios
          .post(`http://localhost:3000/store`, {
            storeName: location,
            list: list,
          })
      })
      .catch((err) => console.log(err));

      return res.status(200).json({text:"done"})
  } catch (error) {
    return res.status(500).json({ error });
  }
}

// async function moveProducts(req,res) {
//   try {
//     var found = args[0]
//       ? await Product.find({ product_name: productName, location: args[0] })
//       : await Product.find({ product_name: productName });
//     if (found.length < Math.abs(amount))
//       throw `no enough products on location: ${args[0]} to complete the request`;
//     found.sort((a, b) => {
//       return a.production_datetime - b.production_datetime;
//     });
//     for (let index = 0; index < Math.abs(amount); index++) {
//       found[index].location = location;
//       const Data = new Product(found[index]);
//       await Data.save();
//     }
//   } catch (error) {
//     throw error;
//   }
// }

// async function moveProducts(productName, amount, location, ...args) {
//   try {
//     var found = args[0]
//       ? await Product.find({ product_name: productName, location: args[0] })
//       : await Product.find({ product_name: productName });
//     if (found.length < Math.abs(amount))
//       throw `no enough products on location: ${args[0]} to complete the request`;
//     found.sort((a, b) => {
//       return a.production_datetime - b.production_datetime;
//     });
//     for (let index = 0; index < Math.abs(amount); index++) {
//       found[index].location = location;
//       const Data = new Product(found[index]);
//       await Data.save();
//     }
//   } catch (error) {
//     throw error;
//   }
// }

async function sendToShelf(req, res) {
  const { productIds, storeName } = req.body;
  let shelves = [];
  let item = {};
  for (let element of productIds) {
    await Product.findOneAndUpdate(
      { _id: element },
      {
        inShelves: true,
      },
      (err, doc) => {
        if (err) console.log(`error: ${err}`);
        item = doc;
      }
    ).then(async () => {
      shelves = await store.find({ storeName: storeName });
      let index;
      let itemExists = false;
      if (shelves.length == 0) {
        const Data = new store({ storeName: storeName, Shelves: [] });
        await Data.save();
        shelves = [Data];
        index = undefined;
        shelves[0].Shelves.push({
          Shelf: "Unclassified",
          Items: [
            {
              name: item.product_name,
              Amount: 1,
              Image: item.image_small_url,
            },
          ],
        });
      } else {
        shelves[0].Shelves.forEach((x, i) => {
          shelves[0].Shelves[i].Items.forEach((el) => {
            if (el.name == item.product_name) {
              itemExists = true;
              el.Amount += 1;
            }
          });
        });

        if (!itemExists) {
          shelves[0].Shelves.find((element, i) => {
            if (element.Shelf == "Unclassified") index = i;
          });
          if (index != -1 && index != undefined) {
            shelves[0].Shelves[index].Items.push({
              name: item.product_name,
              Amount: 1,
              Image: item.image_small_url,
            });
          } else {
            shelves[0].Shelves.push({
              Shelf: "Unclassified",
              Items: [
                {
                  name: item.product_name,
                  Amount: 1,
                  Image: item.image_small_url,
                },
              ],
            });
          }
        }
      }
      axios.post(`http://localhost:3000/store`, {
        storeName: storeName,
        list: shelves[0].Shelves,
      });
    });
  }
  return res.status(200).json({ shelves: shelves });
}

async function takeFromShelf(req, res) {
  const { productIds, storeName } = req.body;
  let shelves = [];
  let item = {};
  for (let element of productIds) {
    await Product.findOneAndUpdate(
      { _id: element },
      {
        inShelves: false,
      },
      (err, doc) => {
        if (err) console.log(`error: ${err}`);
        item = doc;
      }
    ).then(async () => {
      shelves = await store.find({ storeName: storeName });
      shelves[0].Shelves.forEach((x, i) => {
        shelves[0].Shelves[i].Items.forEach((el, index) => {
          if (el.name == item.product_name) {
            if (el.Amount == 1) {
              shelves[0].Shelves[i].Items.splice(index, 1);
            }
            if (el.Amount > 1) {
              el.Amount -= 1;
            }
          }
        });
      });
      axios.post(`http://localhost:3000/store`, {
        storeName: storeName,
        list: shelves[0].Shelves,
      });
    });
  }

  // });
  // .then(() => {
  // }
  return res.status(200).json({ shelves: shelves });
}
// async function addTale(req, res) {
//   const { Title, Body, Type } = req.body;
//   if (!Title || !Body || !Type) {
//     return res.status(400).json({
//       text: "invalid request",
//     });
//   }
//   var a = new Date(Date.now());
//   const tale = {
//     Title,
//     Body,
//     Type,
//     Add_Time: a,
//   };
//   try {
//     // save user in DB
//     const taleData = new Tales(tale);
//     await taleData.save();
//     return res.status(200).json({
//       text: "tale added",
//     });
//   } catch (error) {
//     return res.status(500).json({ error });
//   }
// }

// async function getTales(req, res) {
//   try {
//     const found = await Tales.find();
//     return res.status(200).json({
//       found,
//     });
//   } catch (error) {
//     return res.status(500).json({ error });
//   }
// }
// async function delTales(req, res) {
//   const { Title } = req.body;
//   if (!Title) {
//     return res.status(400).json({
//       text: "invalid request",
//     });
//   }
//   try {
//     // save user in DB
//     const taleData = await Tales.findOneAndDelete({ Title: Title });
//     // await taleData.save();
//     return res.status(200).json({
//       text: "tale " + taleData.Title + " Deleted ",
//     });
//   } catch (error) {
//     return res.status(500).json({ error });
//   }
// }

exports.addProducts = addProducts;
exports.consumerBuyFromStore = consumerBuyFromStore;
exports.consumerBuyFromProducer = consumerBuyFromProducer;
exports.rmProducerEntry = rmProducerEntry;
exports.getProducts = getProducts;
exports.sendToSHelf = sendToShelf;
exports.takeFromSHelf = takeFromShelf;
