/***
 * api/view 路由
 * @param app
 */
module.exports = function (app) {
    require('./api')(app);//api
    require('./controller')(app);//view
};
