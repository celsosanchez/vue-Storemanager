const Product = require("../schema/product")
const axios = require('axios').default

async function addProduct(req, res) {
    const { product, duration_in_days, amount } = req.body;
    if (!product || !duration_in_days || !amount) {
        return res.status(400).json({
            text: "invalid request"
        });
    }

    var openData = "no data received";
    var productData;

    try {
        await axios.get(`https://data.opendatasoft.com/api/records/1.0/search/?dataset=open-food-facts-products%40public&q=&refine.product_name=${product}`)
            .then((res) => {
                openData = res.data.records.fields;

                productData = {

                    labels_fr: res.data.records[0].fields.labels_fr,
                    carbohydrates_100g: res.data.records[0].fields.carbohydrates_100g,
                    salt_100g: res.data.records[0].fields.salt_100g,
                    energy_100g: res.data.records[0].fields.energy_100g,
                    image_nutrition_small_url: res.data.records[0].fields.image_nutrition_small_url,
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
                    ingredients_from_palm_oil_n: res.data.records[0].fields.ingredients_from_palm_oil_n,
                    first_packaging_code_geo: res.data.records[0].fields.first_packaging_code_geo,
                    carbon_footprint_from_meat_or_fish_100g: res.data.records[0].fields.carbon_footprint_from_meat_or_fish_100g,
                    product_name: res.data.records[0].fields.product_name,
                    image_ingredients_small_url: res.data.records[0].fields.image_ingredients_small_url,
                    categories_fr: res.data.records[0].fields.categories_fr,
                    ingredients_that_may_be_from_palm_oil_n: res.data.records[0].fields.ingredients_that_may_be_from_palm_oil_n,
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


                    expiration_datetime: new Date(Date.now() + duration_in_days * 86400000),
                    location: "Producer",

                }
            }).then(async function () {
                var text = [];
                try {
                    // save user in DB
                    for (let index = 0; index < amount; index++) {
                        
                        const Data = new Product(productData);

                        await Data.save();
                        text.push(Data._id)
                    }
                    // const Data = new Product(productData);

                    // await Data.save();
                    return res.status(200).json({
                        text: `product added with id: ${text}`,
                    });
                } catch (error) {
                    console.log(error)
                    return res.status(500).json({ error });
                }

            })
        // console.log(response);





    } catch (error) {
        console.log(error)
        return res.status(500).json({ error });
    }



}




// var a = new Date(Date.now());
// const tale = {
//     Title,
//     Body,
//     Type,
//     Add_Time: a
// };
// try {
//     // save user in DB
//     const taleData = new Tales(tale);
//     await taleData.save();
//     return res.status(200).json({
//         text: "tale added",
//     });
// } catch (error) {
//     return res.status(500).json({ error });
// }

// }


async function addTale(req, res) {
    const { Title, Body, Type } = req.body;
    if (!Title || !Body || !Type) {
        return res.status(400).json({
            text: "invalid request"
        });
    }
    var a = new Date(Date.now());
    const tale = {
        Title,
        Body,
        Type,
        Add_Time: a
    };
    try {
        // save user in DB
        const taleData = new Tales(tale);
        await taleData.save();
        return res.status(200).json({
            text: "tale added",
        });
    } catch (error) {
        return res.status(500).json({ error });
    }

}

async function getTales(req, res) {
    try {
        const found = await Tales.find();
        return res.status(200).json({
            found
        })
    } catch (error) {
        return res.status(500).json({ error });
    }


}
async function delTales(req, res) {
    const { Title } = req.body;
    if (!Title) {
        return res.status(400).json({
            text: "invalid request"
        });
    }


    try {
        // save user in DB
        const taleData = await Tales.findOneAndDelete({ "Title": Title });
        // await taleData.save();
        return res.status(200).json({
            text: "tale " + taleData.Title + " Deleted "
        });
    } catch (error) {
        return res.status(500).json({ error });
    }

}

exports.delTales = delTales;
exports.getTales = getTales;
exports.addTale = addTale;


exports.addProduct = addProduct;