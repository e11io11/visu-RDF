var express = require('express');
var app = express();
var server = require('http').createServer(app);
var graphData = require('./graphData.js')

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('./index.ejs')
});


app.get('/graphData', function (req, res) {
    graphData.getAllTriples(res);
});


server.listen(8080);