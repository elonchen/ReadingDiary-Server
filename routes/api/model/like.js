let mongoose = require('mongoose');
let schema = mongoose.Schema({
    id: {type: String},
    userId: {type: String},
    status: {type: Number, default: 0},
    updateTime: {type: Date, default: Date.now()},
});

let model = mongoose.model('like', schema, 'like');

module.exports = {
    model: model,
    async createOrUpdate(lessonId, userId, status) {
        let count = await  model.countDocuments({lessonId: lessonId, userId: userId});
        if (count > 0) {
            await model.update({lessonId: lessonId, userId: userId}, {status: status, updateTime: Date.now()});//{条件},{要更新的内容}
        } else {
            await model.create({lessonId: lessonId, userId: userId, status: status});
        }
    },
    async find(lessonId, userId) {
        let res = await model.findOne({lessonId: lessonId, userId: userId}, {lessonId: true, status: true});//{条件},{要查询的字段}
        return res;
    }
}