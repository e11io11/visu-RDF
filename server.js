var express = require('express');
var app = express();
var server = require('http').createServer(app);
var sparql = require('./sparql.js')

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('./index.ejs')
});


app.get('/sparql', function (req, res) {
    console.log("request :"+ req.query.name)
    if (req.query.func === 'getTriplesByNameAndDegree') {
        sparql.getTriplesByNameAndDegree(res, req.query.name, req.query.minDegree, req.query.limit);
    }

    else if (req.query.func === 'getAllTriples') {
        sparql.getAllTriples(res, req.query.limit);
    }
    else {
        console.log("function not found");
    }
});


server.listen(8080);