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
    app.post(apiPrefix + '/lessons/favor', lesson.favorPOST);
    app.get(apiPrefix + '/lessons/favor', lesson.favorGET);
    app.get(apiPrefix + '/lessons/favor_list', lesson.favorList);


    //user
    let user = require('./api/user');
    app.post(apiPrefix + '/user', user.login0regist);
    app.get(apiPrefix + '/user/info', user.userInfo);
    app.post(apiPrefix + '/user/update', user.update);


    //comment
    let comment = require('./api/comment');
    app.get(apiPrefix + '/comments', comment.commontList);
    app.post(apiPrefix + '/comment', comment.commontPOST);
    app.get(apiPrefix + '/sub_comments', comment.subCommontList);
    app.post(apiPrefix + '/sub_comment', comment.subCommontPOST);
    app.post(apiPrefix + '/comment_like', comment.commontLikePOST);
};