const product = require("./product");
const store = require("./store");
const user = require("./user");
const passport = require("passport");
const User = require('../schema/user');
const { session } = require("passport");

const protectRoute = (req, res, next) => {
    if (req.user) return next();
    return res.redirect('/auth/google');
}


module.exports = function (app) {

    app.put('/producer', product.addProducts);
    app.post('/products',  product.getProducts);
    app.patch('/producer', product.consumerBuyFromProducer);
    app.delete('/producer', product.rmProducerEntry);

    app.put('/ProductToShelf', product.sendToSHelf);
    app.put('/ProductFromShelf', product.takeFromSHelf);

    app.put('/UpdateSLfromDS', user.UpdateSLfromDS);
    app.put('/usersShoppingList', user.addToSL);
    app.get('/users', user.getUsers);
    app.put('/users', user.addToDS);
    

    app.get('/store', store.getStore);
    app.post('/store', store.addToShelves);
    app.put('/store', store.createStore);
    

    //-----auth---
    app.get("/auth/google", passport.authenticate("google", {
        scope: ["profile", "email"]
    }));
    app.get("/auth/google/redirect", passport.authenticate('google'), async (req, res) => {
        // console.log(req.user)
        const user = await User.findById(req.user);
        // console.log(user)
        req.user = user;
        
        // console.log(req.user)

        res.redirect('http://localhost:8080');
    });
}



