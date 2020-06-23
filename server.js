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
    sparql.getTriplesWithSubject(res, "http://skos.um.es/unescothes/C03689");
});


server.listen(8080);