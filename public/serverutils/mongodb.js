/**
 * Created by LSD on 18/7/2.
 */
let config = require('../../config');

//mongodb初始化
exports.init = function () {
    let mongoose = require('mongoose');
    let mongodbConnection = 'mongodb://' + config.mongodb.user + ':' + config.mongodb.password + '@' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.database;
    mongoose.connect(mongodbConnection, { useNewUrlParser: true }, function (err, res) {
        if (err) {
            console.log(err)
        }
    });
}
