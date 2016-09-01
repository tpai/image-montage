require('dotenv').config();
var path = require('path');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var port = process.env.PORT || 8080;
var mustacheExpress = require('mustache-express');

var root = path.resolve(__dirname + '/public');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', root);
app.use(express.static(root));

app.get('/', function (req, res) {
    res.render('index', {
        CLIENT_ID: process.env.CLIENT_ID
    });
});

http.listen(port, function() {
    console.log("Listening http://localhost:" + port);
});
