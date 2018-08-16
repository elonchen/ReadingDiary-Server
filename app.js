var express = require('express');
var app = express();
var config = require('./config')

//express application settings
require('./system/express')(app);

//routes
require('./routes')(app);

//error catch
require('./system/catch')(app);

//start server
//start server
var port = process.env.PORT || config.port;
app.listen(port, function () {
    console.log(process.env.NODE_ENV);
    console.log('Listening on port %d', port);
});