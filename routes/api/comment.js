let comm = require('../../public/serverutils/common')
let Server = require('../../public/serverutils/ServerHttp')

//model
let commontModel = require('./model/comment');
let mLikeModel = require('./model/commentLike');
let lessonModel = require('./model/lesson');

//评论
exports.commontPOST = async function (req, res, next) {
    var mRes = comm.result();
    let userId = req.body.userId;
    if (!userId) {
        mRes.error = 1;
        mRes.msg = "用户未登录";
        return res.send(mRes);
    }
    let lesson_id = req.body.lesson_id;
    let content = req.body.content;
    if (!lesson_id || !content) {
        mRes.error = 1;
        mRes.msg = "参数不全";
        return res.send(mRes);
    }
    var item = {user: userId, lesson_id: lesson_id, content: content};
    await commontModel.createItem(item);
    await lessonModel.updateCommentCount(lesson_id);
    return res.send(mRes);
}

//评论点赞
exports.commontLikePOST = async function (req, res, next) {
    var mRes = comm.result();
    let userId = req.body.userId;
    let comment_id = req.body.comment_id;
    var status = req.body.status;
    status = (status === "true");
    if (!userId) {
        mRes.error = 1;
        mRes.msg = "用户未登录";
        return res.send(mRes);
    }
    if (!comment_id) {
        mRes.error = 1;
        mRes.msg = "参数不全";
        return res.send(mRes);
    }
    var item = {userId: userId, commentId: comment_id, status: status};
    await mLikeModel.createItem(item);
    await commontModel.updateLikeCount(comment_id, status);
    return res.send(mRes);
}

//子评论
exports.subCommontPOST = async function (req, res, next) {
    var mRes = comm.result();
    let userId = req.body.userId;
    if (!userId) {
        mRes.error = 1;
        mRes.msg = "用户未登录";
        return res.send(mRes);
    }
    let comment_id = req.body.comment_id;
    let content = req.body.content;
    if (!comment_id || !content) {
        mRes.error = 1;
        mRes.msg = "参数不全";
        return res.send(mRes);
    }
    var item = {userId: userId, fcomment_id: comment_id, content: content};
    await commontModel.createItem(item);
    await commontModel.updateCommentCount(comment_id);
    return res.send(mRes);
}

//获取评论列表
exports.commontList = async function (req, res, next) {
    var mRes = comm.result();
    let userId = req.query.userId;
    let lesson_id = req.query.lesson_id;
    let start = req.query.start;
    if (!start) {
        start = 0;
    }
    let size = req.query.size;
    if (!size) {
        size = 40;
    }
    let count = await commontModel.listCount(lesson_id);
    let data = await commontModel.findList(lesson_id, userId, start, size);
    if (data && data.length < size) {
        let limit = size - data.length;
        var offset = start - count;
        if (offset < 0) {
            offset = 0;
        }
        var url = "https://rike-api.moreless.io/v1/lessons/" + lesson_id + "/comments?limit=" + limit + "&offset=" + offset;
        var nRes = await Server.HTTP_GET(url);
        if(nRes.error == 0) {
            var nData = nRes.data;
            for (var item of nData) {
                item.my_like = await mLikeModel.findStatus(userId, item.id);
            }
            data = data.concat(nData);
        }
    }
    mRes.data = data;
    return res.send(mRes);
}

//子评论列表
exports.subCommontList = async function (req, res, next) {
    var mRes = comm.result();
    let userId = req.query.userId;
    let fcomment_id = req.query.fcomment_id;
    let start = req.query.start;
    if (!start) {
        start = 0;
    }
    let size = req.query.size;
    if (!size) {
        size = 40;
    }
    let count = await commontModel.subListCount(fcomment_id);
    let data = await commontModel.findSubList(fcomment_id, userId, start, size);
    if (data && data.length < size) {
        let limit = size - data.length;
        var offset = start - count;
        if (offset < 0) {
            offset = 0;
        }
        var url = "https://rike-api.moreless.io/v1/comments/" + fcomment_id + "/comments?limit=" + limit + "&offset=" + offset;
        var nRes = await Server.HTTP_GET(url);
        if(nRes.error == 0){
            var nData = nRes.data;
            for (var item of nData) {
                item.my_like = await mLikeModel.findStatus(userId, item.id);
            }
            data = data.concat(nData);
        }
    }
    mRes.data = data;
    return res.send(mRes);
}