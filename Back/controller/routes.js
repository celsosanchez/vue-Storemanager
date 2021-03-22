const product = require("./product")


const protectRoute = ( req,res, next) => {
    if (req.user) return next();
    return res.redirect('/auth/google');
}


module.exports = function (app) {
    // app.delete('/tales', tales.delTale);
    
    //add product for a producer
    app.put('/producer', product.addProducts);
    app.get('/products', protectRoute,product.getProducts);
    app.patch('/producer', product.moveProducts);
    app.delete('/producer', product.rmProducerEntry);

    // app.get('/producer', product.getTales);
    // app.delete('/producer', product.delTales);
}