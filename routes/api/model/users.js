let comm = require('../../../public/serverutils/common')
let mongoose = require('mongoose');
let schema = mongoose.Schema({
    phone: {type: String},
    pass: {type: String},
    nickname: {type: String},
    sign: {type: String},
    avatar: {type: String},
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

let model = mongoose.model('users', schema, 'users');

module.exports = {
    model: model,
    async createOrUpdate(phone, pass) {
        let count = await  model.countDocuments({phone: phone});
        let mRes = comm.result();
        if (count > 0) {
            var userInfo = await model.findOne({phone: phone, pass: pass});
            if (userInfo) {
                mRes.data = userInfo;
            } else {
                mRes.error = 1;
                mRes.msg = "手机号或密码错误";
            }
        } else {
            mRes.data = await model.create({phone: phone, pass: pass});
        }
        return mRes;
    },
    async find(userId) {
        let res = await model.findOne({_id: userId}, {pass: false});//{条件},{要查询的字段}
        return res || {};
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