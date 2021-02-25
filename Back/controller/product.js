const Tales = require("../schema/product")


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
    const { Title} = req.body;
    if (!Title ) {
        return res.status(400).json({
            text: "invalid request"
        });
    }
    
    
    try {
        // save user in DB
        const taleData = await Tales.findOneAndDelete({"Title" : Title} );
        // await taleData.save();
        return res.status(200).json({
            text: "tale "+ taleData.Title +" Deleted "
        });
    } catch (error) {
        return res.status(500).json({ error });
    }

}

exports.delTales = delTales;
exports.getTales = getTales;
exports.addTale = addTale;