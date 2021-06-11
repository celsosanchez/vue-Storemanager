const product = require("./product");
const user = require("./user");
const passport = require("passport");
// const User = require('../schema/user');

const protectRoute = (req, res, next) => {
    if (req.user) return next();
    return res.redirect('/auth/google');
}


module.exports = function (app) {

    app.put('/producer', product.addProducts);
    app.get('/users', user.getUsers);
    app.put('/users', user.addToDS);
    app.put('/usersShoppingList', user.addToSL);
    app.put('/UpdateSLfromDS', user.UpdateSLfromDS);
    // app.get('/products', protectRoute, product.getProducts);
    app.post('/products',  product.getProducts);
    // app.patch('/producer', product.moveProducts);
    app.patch('/producer', product.consumerBuyFromProducer);
    app.delete('/producer', product.rmProducerEntry);

    //-----auth---
    app.get("/auth/google", passport.authenticate("google", {
        scope: ["profile", "email"]
    }));
    app.get("/auth/google/redirect", passport.authenticate('google'), async (req, res) => {
        const user = await User.findById(req.user);
        res.send(`Hi there ${user.name}`)
    });
}



