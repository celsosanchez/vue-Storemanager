const Store = require("../schema/store");
const axios = require("axios").default;

async function addToShelves(req, res) {
  const { storeName, list } = req.body;
  if (!storeName || !list) {
    return res.status(400).json({
      text: "invalid request",
    });
  }
  try {
    await Store.findOneAndUpdate(
      { storeName: storeName },
      { Shelves: list },
      (err, doc) => {
        if (err) console.log(`error: ${err}`);
        return res.send(doc);
      }
    );
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function getStore(req, res) {
  const { storeName} = req.query;
  if (!storeName) {
    return res.status(400).json({
      text: "invalid request",
    });
  }
  try {
    const found = await Store.find({ storeName: storeName });
    return res.status(200).json({
      found,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function createStore(req, res) {
  const { storeName } = req.body;
  try {
    const Data = new Store({ storeName: storeName });
    await Data.save();
   
    return res.status(200).json({
      res: "done",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

exports.createStore = createStore;
exports.getStore = getStore;
exports.addToShelves = addToShelves;
 
