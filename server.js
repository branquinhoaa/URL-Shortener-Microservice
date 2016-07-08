require('dotenv').config();
var express = require('express');
var app = express();
var port = process.env.PORT ||  8080;
var route = require("./route.js");

route(app);

app.listen(port, function(){
    console.log("listening port "+port);
});

