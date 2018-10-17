let config = require('../../config')
let Server = require('../../public/serverutils/ServerHttp')
let comm = require('../../public/serverutils/common')
let base = config.RK_BASEURL + "/" + config.API_VISION;

//model
let lessonModel = require('./model/lesson');
let favorModel = require('./model/favor');

//获取列表
exports.rikeList = async function (from, to, updated_at) {
    if (!from) {
        from = "20180101";
    }
    if (!to) {
        to = "20190726";
    }
    if (!updated_at) {
        updated_at = "1514736000";
    }
    var url = base + "/lessons?from=" + from + "&to=" + to + "&updated_at=" + updated_at;
    var mRes = await Server.HTTP_GET(url);
    return mRes;
}

//课程列表
exports.lessonList = async function (req, res, next) {
    var mRes = comm.result();
    mRes.data = await lessonModel.findList();
    return res.send(mRes)
}

//点赞、评论数
exports.activityStats = async function (req, res, next) {
    var mRes = comm.result();
    let date_by_day = req.query.date_by_day;//文章日期
    if (!date_by_day) {
        mRes.error = 1;
        mRes.msg = "文章日期错误";
        return res.send(mRes)
    }
    var dbData = await lessonModel.findFavCount(date_by_day);
    var url = base + "/lessons/" + date_by_day + "/activity_stats";
    mRes = await Server.HTTP_GET(url);
    if (dbData) {
        mRes.data.comment_count = mRes.data.comment_count + dbData.comment_count;
        mRes.data.favourite_count = mRes.data.favourite_count + dbData.favourite_count;
    }
    return res.send(mRes)
}

//点赞删除点赞
exports.favorPOST = async function (req, res, next) {
    var mRes = comm.result();
    let lessonId = req.body.lessonId;//文章id
    let date_by_day = req.body.date_by_day;
    let userId = req.body.userId;
    var status = req.body.status;
    status = (status === "true");
    if (!lessonId) {
        mRes.error = 1;
        mRes.msg = "文章id错误";
        return res.send(mRes)
    }
    if (!date_by_day) {
        mRes.error = 1;
        mRes.msg = "文章日期错误";
        return res.send(mRes)
    }
    if (!userId) {
        mRes.error = 1;
        mRes.msg = "请登陆！";
        return res.send(mRes)
    }
    await lessonModel.updateFavCount(date_by_day, status);
    mRes.data = await favorModel.createOrUpdate(lessonId, userId, status);
    return res.send(mRes)
}

//获取点赞状态
exports.favorGET = async function (req, res, next) {
    var mRes = comm.result();
    let lessonId = req.query.lessonId;//文章id
    let userId = req.query.userId;
    if (!lessonId) {
        mRes.error = 1;
        mRes.msg = "文章id错误";
        return res.send(mRes)
    }
    if (!userId) {
        mRes.error = 1;
        mRes.msg = "请登陆！";
        return res.send(mRes)
    }
    mRes.data = await favorModel.findFavStatus(lessonId, userId);
    return res.send(mRes)
}

//我的喜欢列表
exports.favorList = async function (req, res, next) {
    var mRes = comm.result();
    let userId = req.query.userId;
    if (!userId) {
        mRes.error = 1;
        mRes.msg = "请登陆！";
        return res.send(mRes)
    }
    var favList = await favorModel.findFavList(userId);
    var favTransList = [];
    favList.forEach(function (item) {
        favTransList.push(item.lessonId);
    })
    mRes.data = await lessonModel.findListByids(favTransList);
    return res.send(mRes)
}
