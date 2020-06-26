var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var graphData = require('./graphData.js')
//import { sparql } from './sparql.js';
var sparql = require('./sparql.js')

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('./index.ejs')
});


app.get('/sparql', function (req, res) {
    if (req.query.func === 'getTriplesByNameAndDegree') {
        sparql.getTriplesByNameAndDegree(res, req.query.name, req.query.minDegree );
    }
});


server.listen(8080);