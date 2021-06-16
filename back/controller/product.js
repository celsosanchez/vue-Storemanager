const Product = require("../schema/product");
const ProducerStockEntry = require("../schema/producer_stock");
const axios = require("axios").default;
// const User = require("../schema/user");
// const log = require("../lib/logger");

async function addProducts(req, res) {
  const { product, duration_in_days, amount } = req.body;
  if (!product || !duration_in_days || !amount) {
    return res.status(400).json({
      text: "invalid request",
    });
  }

  var openData = "no data received";
  var productData;
  try {
    await axios
      .get(
        `https://data.opendatasoft.com/api/records/1.0/search/?dataset=open-food-facts-products%40public&q=&refine.product_name=${product}`
      )
      .then((res) => {
        openData = res.data.records.fields;
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
          availableToBuyerAt:  Date.now(),
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
          const stock = new ProducerStockEntry(prod_stock);
          stock.save();
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
      text: "invalid request, specify product name, amount to remove, reason and new location",
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
  const { productId, buyer, buyerLocation ,productLocation} = req.body.data;
  let time, geoLocation;
  if (productLocation.length == 0){
    geoLocation = [48.1147,-1.6794];
  }else{
    console.log(productLocation)
    geoLocation = productLocation; 
  }
  console.log(` geolocationm product location ${geoLocation}`)
  try {
    await axios.post(
      "http://www.mapquestapi.com/directions/v2/routematrix?key=RGptLi1WllF7egmD9YAzMwR6s37hXoaF",
      {
        locations: [
          {
            latLng: {
              lat: buyerLocation[0],
              lng:  buyerLocation[1],
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
    ).then((res)=>{
      time = res.data.time[1]

      console.log(`time received from external api`)
      // console.log(res.data.time)
    }).catch(err => {console.log(err)});
    let timeOfBuy =  Date.now();
    console.log( Date.now())
    // console.log(Date.now()+7200000)
    let available = timeOfBuy + time*1000 
     console.log(`time assigned to available var`)
    await Product.findOneAndUpdate(
      
      { _id: productId },
      {
        location: buyer,
        availableToBuyerAt: available,
        timeOfBuy: timeOfBuy
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

async function moveProducts(productName, amount, location, ...args) {
  try {
    var found = args[0]
      ? await Product.find({ product_name: productName, location: args[0] })
      : await Product.find({ product_name: productName });
    if (found.length < Math.abs(amount))
      throw `no enough products on location: ${args[0]} to complete the request`;
    found.sort((a, b) => {
      return a.production_datetime - b.production_datetime;
    });
    for (let index = 0; index < Math.abs(amount); index++) {
      found[index].location = location;
      const Data = new Product(found[index]);
      await Data.save();
    }
  } catch (error) {
    throw error;
  }
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
exports.moveProducts = moveProducts;
exports.consumerBuyFromProducer = consumerBuyFromProducer;
exports.rmProducerEntry = rmProducerEntry;
exports.getProducts = getProducts;
