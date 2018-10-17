let mongoose = require('mongoose');
let mLikeModel = require('./commentLike');
const Schema = mongoose.Schema;
let schema = Schema({
    fcomment_id: {type: String},
    lesson_id: {type: String},
    // userId: {type: String},
    content: {type: String},
    like_count: {type: Number, default: 0},
    sub_comment_count: {type: Number, default: 0},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users' //连表查询的数据库表名字 : 用户表
    },
    updateTime: {type: Date, default: Date.now()},
});
schema.options.toObject = {
    //把_id转换成id
    transform(doc, ret, options) {
        ret.id = doc.id;
        delete ret._id;
        return ret;
    }
};
let model = mongoose.model('comment', schema, 'comment');

module.exports = {
    model: model,
    async createItem(item) {
        model.create(item)
    },
    async listCount(lesson_id) {
        let count = await model.countDocuments({lesson_id: lesson_id});
        return count;
    },
    async findList(lesson_id, userId, start, size) {
        var res = await model.find({lesson_id: lesson_id}, {__v: false}).sort({updateTime: -1}).skip(start * 1).limit(size * 1).populate('user', {
            nickname: true,
            avatar: true
        });
        for (var item of res) {
            item._doc.my_like = await mLikeModel.findStatus(userId, item.id);
        }
        return res;
    },
    async updateCommentCount(comment_id) {
        await model.update({_id: comment_id}, {$inc: {sub_comment_count: +1}});//{条件},{要更新的内容}
    },
    async updateLikeCount(comment_id, status) {
        if (status) {
            //{条件},{要更新的内容}
            await model.update({_id: comment_id}, {$inc: {like_count: +1}});
        } else {
            await model.update({_id: comment_id}, {$inc: {like_count: -1}});
        }
    },
    async subListCount(fcomment_id) {
        let count = await model.countDocuments({fcomment_id: fcomment_id});
        return count;
    },
    async findSubList(fcomment_id, userId, start, size) {
        var res = await model.find({fcomment_id: fcomment_id}, {__v: false}).skip(start * 1).limit(size * 1).populate('user', {
            nickname: true,
            avatar: true
        });
        for (var item of res) {
            item._doc.my_like = await mLikeModel.findStatus(userId, item.id);
        }
        return res;
    },
}


