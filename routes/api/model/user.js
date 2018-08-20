let mongoose = require('mongoose');
let schema = mongoose.Schema({
    phone: {type: String},
    pass: {type: String},
    nickname: {type: String},
    sign: {type: String},
    avatar: {type: String},
    updateTime: {type: Date, default: Date.now()},
});

let model = mongoose.model('user', schema, 'user');

module.exports = {
    model: model,
    async createOrUpdate(phone, pass) {
        let count = await  model.countDocuments({phone: phone, pass: pass});
        let res = {};
        if (count > 0) {
            res = await model.findOne({phone: phone, pass: pass});
        } else {
            res = await model.create({phone: phone, pass: pass});
        }
        return res;
    },
    async find(userId) {
        let res = await model.findOne({_id: userId}, {pass: false});//{条件},{要查询的字段}
        return res;
    },
    async updateInfo(userId, pass, nickname, sign, avatar) {
        var updateRow = {};
        if (pass) {
            updateRow.pass = pass
        }
        if (nickname) {
            updateRow.nickname = nickname
        }
        if (sign) {
            updateRow.sign = sign
        }
        if (avatar) {
            updateRow.avatar = avatar
        }
        await model.update({_id: userId}, updateRow);//{条件},{要更新的字段}
        return this.find(userId);
    }
}