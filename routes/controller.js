/***
 * view路由
 * @param app
 */
module.exports = function (app) {
    //Index
    app.get('/', function (req, res) {
        res.render('index', {title: 'Express'});
    });
};