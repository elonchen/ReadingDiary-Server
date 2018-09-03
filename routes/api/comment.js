let comm = require('../../public/serverutils/common')
let Server = require('../../public/serverutils/ServerHttp')

//model
let commontModel = require('./model/comment');

exports.testGetList = async function (req, res, next) {
    var url = "https://rike-api.moreless.io/v1/lessons/5b7ed4a19f54540031f6c919/comments?limit=256&offset=0"
    var mRes = await Server.HTTP_GET(url);
    await commontModel.createList(mRes.data);
    return res.send(mRes);
}

exports.forGetList = async function (req, res, next) {
    var mRes = comm.result()
    mRes.data = await commontModel.findList();
    return res.send(mRes);
}