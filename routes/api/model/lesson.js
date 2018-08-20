let mongoose = require('mongoose');
let schema = mongoose.Schema({
    lessonId: {type: String},
    date_by_day: {type: String},
    comment_count: {type: Number, default: 0},
    favourite_count: {type: Number, default: 0},
    updateTime: {type: Date, default: Date.now()},
});

let model = mongoose.model('lesson', schema, 'lesson');

module.exports = {
    model: model,
    async createOrUpdate(lessonId, date_by_day, status) {
        let data = await model.find({date_by_day: date_by_day});
        if (data.length > 0) {
            if (status == 1) {
                //{条件},{要更新的内容}
                await model.update({date_by_day: date_by_day}, {
                    favourite_count: data[0].favourite_count + 1, updateTime: Date.now()
                });
            } else {
                await model.update({date_by_day: date_by_day}, {
                    favourite_count: data[0].favourite_count + 1, updateTime: Date.now()
                });
            }
        } else {
            await model.create({lessonId: lessonId, date_by_day: date_by_day, favourite_count: 1});
        }
    },
    async find(date_by_day) {
        let res = await model.findOne({date_by_day: date_by_day}, {comment_count: true, favourite_count: true});
        return res;
    }
}