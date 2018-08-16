const base = require('./base');
//通过package.josn文件中的scripts配置环境 / 直接pm2启动时候配置环境
const env = process.env.NODE_ENV;
let config = {};
if (env === base.PROD) {
    config = Object.assign({}, base, require('./prod'));
} else {
    config = Object.assign({}, base, require('./dev'));
}
module.exports = config;
