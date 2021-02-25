const tales = require("./product")



module.exports = function (app) {
    // app.delete('/tales', tales.delTale);
    app.put('/tales', tales.addTale);
    app.get('/tales', tales.getTales);
    app.delete('/tales', tales.delTales);
}