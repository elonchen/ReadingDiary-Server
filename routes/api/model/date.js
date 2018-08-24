let mongoose = require('mongoose');
let schema = mongoose.Schema({
    lessonUpdate: {type: String, default: '1514736000'},
});

let model = mongoose.model('date', schema, 'date');

module.exports = {
    model: model,
    async findDate() {
        let res = await model.findOne({});
        return res;
    },
    async createDate(date) {
        await model.create({lessonUpdate: date});
    },
    async updateDate(id, date) {
        await model.update({_id: id}, {lessonUpdate: date});
    }
}