let mongoose = require('mongoose');
let schema = mongoose.Schema({
    id: {type: String},
    userId: {type: String},
    lessonId: {type: String},
    status: {type: Boolean, default: false},
    updateTime: {type: Date, default: Date.now()},
});

let model = mongoose.model('favor', schema, 'favor');

module.exports = {
    model: model,
    async createOrUpdate(lessonId, userId, status) {
        let count = await  model.countDocuments({lessonId: lessonId, userId: userId});
        if (count > 0) {
            await model.update({lessonId: lessonId, userId: userId}, {status: status, updateTime: Date.now()});//{条件},{要更新的内容}
        } else {
            await model.create({lessonId: lessonId, userId: userId, status: status});
        }
        return this.findFavStatus(lessonId, userId);
    },
    async findFavStatus(lessonId, userId) {
        let res = await model.findOne({lessonId: lessonId, userId: userId}, {_id: false, lessonId: true, status: true});//{条件},{要查询的字段}
        return res || {"lessonId": lessonId, "status": false};
    },
    async findFavList(userId) {
        let res = await model.find({userId: userId}, {_id: false, lessonId: true});//{条件},{要查询的字段}
        return res || [];
    }
}