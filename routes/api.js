/***
 * api路由
 * @param app
 */
module.exports = function (app) {
    //lesson
    let lesson = require('./api/lesson');
    app.get('/api/lessons', lesson.lessonList);
    app.get('/api/lessons/activity_stats', lesson.activityStats);
    app.post('/api/lessons/like', lesson.likePOST);
    app.get('/api/lessons/like', lesson.likeGET);


    //user
    let user = require('./api/user');
    app.post('/api/user', user.login0regist);
    app.get('/api/user/info', user.userInfo);
    app.post('/api/user/update', user.update);
};