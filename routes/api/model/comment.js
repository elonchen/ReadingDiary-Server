let mongoose = require('mongoose');
const Schema = mongoose.Schema;
let schema = Schema({
    fcomment_id: {type: String},
    lesson_id: {type: String},
    userId: {type: String},
    content: {type: String},
    like_count: {type: Number, default: 0},
    sub_comment_count: {type: Number, default: 0},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users' //连表查询的数据库表名字
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
    async createList(list) {
        model.create(list)
    },
    async findList() {
        return await model.find({},{__v:false}).populate('user',{phone:true})
    },
}