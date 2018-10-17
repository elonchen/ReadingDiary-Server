let mongoose = require('mongoose');
const Schema = mongoose.Schema;
let schema = Schema({
    userId: {type: String},
    commentId: {type: String},
    status: {type: Boolean, default: false},
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

let model = mongoose.model('commentLike', schema, 'commentLike');

module.exports = {
    model: model,
    async createItem(item) {
        model.create(item)
    },
    async findStatus(userId, commentId) {
        var res = await model.findOne({userId: userId, commentId: commentId}, {status: true});
        if (res) {
            return res.status;
        } else {
            return false;
        }
    }
}