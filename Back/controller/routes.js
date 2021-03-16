const product = require("./product")



module.exports = function (app) {
    // app.delete('/tales', tales.delTale);
    
    //add product for a producer
    app.put('/producer', product.addProduct);
    app.get('/producer', product.getProducts);
    // app.get('/producer', product.getTales);
    // app.delete('/producer', product.delTales);
}