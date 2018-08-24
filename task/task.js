var schedule = require('node-schedule');
var lessonApi = require('../routes/api/lesson')
var lessonModel = require('../routes/api/model/lesson')
var dateModel = require('../routes/api/model/date')


exports.execute = async function () {
    var mRes = await lessonModel.findList();
    if (mRes && mRes.length > 0) {
        schedule.scheduleJob('0 0 1 * * *', function () {//每天凌晨1点执行定时任务
            getUpdateDay()//获取每天更新的
        });
        return;
    }
    getRikeList();//首次获取之前的列表
}

async function getRikeList() {
    var updated_at = "1514736000";
    var mNes = await lessonApi.rikeList(null, null, updated_at);
    if (mNes && mNes.error == 0) {
        await lessonModel.saveList(mNes.data);
        //更新时间
        updated_at = (new Date().getTime() / 1000).toFixed(0)
        await dateModel.createDate(updated_at)
    } else {
        console.error("抓取日课列表失败")
    }
}

async function getUpdateDay() {
    var model = await dateModel.findDate();
    var updated_at = model.lessonUpdate;
    var mNes = await lessonApi.rikeList(null, null, updated_at);
    if (mNes && mNes.error == 0) {
        await lessonModel.checkAndSaveList(mNes.data);
        //更新时间
        updated_at = (new Date().getTime() / 1000).toFixed(0)
        await dateModel.updateDate(model._id, updated_at)
    } else {
        console.error("抓取日课更新失败")
    }
}