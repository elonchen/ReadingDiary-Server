let mongoose = require('mongoose');
let schema = mongoose.Schema({
    id: {type: String},
    article: {type: String},
    title: {type: String},
    provenance: {type: String},
    date_by_day: {type: Number},
    author: {type: Object},
    comment_count: {type: Number, default: 0},
    favourite_count: {type: Number, default: 0},
    updated_at: {type: Number},
    created_at: {type: Number}
});

let model = mongoose.model('lesson', schema, 'lesson');

module.exports = {
    model: model,
    async saveList(list) {
        return await model.create(list)
    },
    async checkAndSaveList(list) {
        list.forEach(async function (item) {
            let count = await model.countDocuments({date_by_day: item.date_by_day});
            if (count == 0) {
                await model.create(item);
            }
        });
    },
    async findFavCount(date_by_day) {
        let res = await model.findOne({date_by_day: date_by_day}, {
            comment_count: true, favourite_count: true
        });
        return res;
    },
    async updateCommentCount(id) {
        await model.update({id: id}, {$inc: {comment_count: +1}});
    },
    async updateFavCount(date_by_day, status) {
        if (status) {
            //{条件},{要更新的内容}
            await model.update({date_by_day: date_by_day}, {$inc: {favourite_count: +1}});
        } else {
            await model.update({date_by_day: date_by_day}, {$inc: {favourite_count: -1}});
        }
    },
    async findList() {
        let res = await model.find({}, {_id: false, __v: false}).sort({updated_at: 1});
        return res;
    },
    async findListByids(ids) {
        let res = await model.find({id: {$in: ids}}, {_id: false, __v: false});
        return res;
    },
}