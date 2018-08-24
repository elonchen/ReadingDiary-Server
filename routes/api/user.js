let comm = require('../../public/serverutils/common')

//model
let user = require('./model/users');

exports.login0regist = async function (req, res, next) {
    let phone = req.body.phone;
    let pass = req.body.pass;
    var mRes = comm.result();
    if (!phone || !pass) {
        mRes.error = 1;
        mRes.msg = "请输入手机号和密码";
        return res.send(mRes)
    }
    mRes = await user.createOrUpdate(phone, pass);
    return res.send(mRes)
}

exports.userInfo = async function (req, res, next) {
    var mRes = comm.result();
    let userId = req.query.userId;
    if (!userId) {
        mRes.error = 1;
        mRes.msg = "用户未登录";
        return res.send(mRes)
    }
    mRes.data = await user.find(userId);
    return res.send(mRes)
}

exports.update = async function (req, res, next) {
    var mRes = comm.result();
    let userId = req.body.userId;
    let pass = req.body.pass;
    let nickname = req.body.nickname;
    let sign = req.body.sign;
    let avatar = req.body.avatar;
    if (!userId) {
        mRes.error = 1;
        mRes.msg = "用户未登录";
        return res.send(mRes)
    }
    mRes.data = await user.updateInfo(userId, pass, nickname, sign, avatar);
    return res.send(mRes)
}