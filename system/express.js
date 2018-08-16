/**
 * Created by LSD on 2017/3/28.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');

module.exports = function (app) {
    // view engine setup
    app.set('views', path.join(__dirname+'/..', 'views'));
    //app.set('view engine', 'ejs');
    app.set('view engine', 'html');
    app.engine('.html', require('ejs').__express);

   // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname+'/..', 'public')));
};

