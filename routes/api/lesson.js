let config = require('../../config')
let Server = require('../../public/serverutils/ServerHttp')
let comm = require('../../public/serverutils/common')
let base = config.RK_BASEURL + "/" + config.API_VISION;

//model
let lesson = require('./model/lesson');
let like = require('./model/like');

//课程列表
exports.lessonList = async function (req, res, next) {
    let from = req.query.from;//开始时间20180101
    let to = req.query.to;//结束时间
    let updated_at = req.query.updated_at;//结束时间
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
    return res.send(mRes)
}

//点赞、收藏数
exports.activityStats = async function (req, res, next) {
    var mRes = comm.result();
    let date_by_day = req.query.date_by_day;//文章日期
    if (!date_by_day) {
        mRes.error = 1;
        mRes.msg = "文章日期错误";
        return res.send(mRes)
    }
    var dbData = await lesson.find(date_by_day);
    var url = base + "/lessons/" + date_by_day + "/activity_stats";
    mRes = await Server.HTTP_GET(url);
    if (dbData) {
        mRes.data.comment_count = mRes.data.comment_count + dbData.comment_count;
        mRes.data.favourite_count = mRes.data.favourite_count + dbData.favourite_count;
    }
    return res.send(mRes)
}

//点赞删除点赞
exports.likePOST = async function (req, res, next) {
    var mRes = comm.result();
    let lessonId = req.body.lessonId;//文章id
    let date_by_day = req.body.date_by_day;
    let userId = req.body.userId;
    let status = req.body.status;
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
    await like.createOrUpdate(lessonId, userId, status);
    await lesson.createOrUpdate(lessonId, date_by_day, status);
    return res.send(mRes)
}

//获取点赞状态
exports.likeGET = async function (req, res, next) {
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
    mRes.data = await like.find(lessonId, userId);
    return res.send(mRes)
}
