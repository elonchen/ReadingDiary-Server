/***
 * api路由
 * @param app
 */
var config = require('../config');
var apiPrefix = '/api/' + config.API_VISION;

module.exports = function (app) {
    //lesson
    let lesson = require('./api/lesson');
    app.get(apiPrefix + '/lessons', lesson.lessonList);
    app.get(apiPrefix + '/lessons/activity_stats', lesson.activityStats);
    app.post(apiPrefix + '/lessons/like', lesson.likePOST);
    app.get(apiPrefix + '/lessons/like', lesson.likeGET);


    //user
    let user = require('./api/user');
    app.post(apiPrefix + '/user', user.login0regist);
    app.get(apiPrefix + '/user/info', user.userInfo);
    app.post(apiPrefix + '/user/update', user.update);
};