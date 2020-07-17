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
    console.log("function : "+req.query.func)
    if (req.query.func === 'getTriplesByNameAndDegree') {
        sparql.getTriplesByNameAndDegree(res, req.query.name, req.query.minDegree, req.query.limit);
    }

    else if (req.query.func === 'getAllTriplesWithLimit') {
        sparql.getAllTriples(res, req.query.limit);
    }

    else if (req.query.func === 'getNodes') {
        sparql.getNodes(res, req.query.limit, req.query.offset);
    }

    else if (req.query.func === 'getNodesWithFilter') {
        sparql.getNodesWithFilter(res, req.query.limit, req.query.offset, req.query.filter);
    }

    else if (req.query.func === 'getInitTriples') {
        sparql.getInitTriples(res, req.query.limit);
    }

    else if (req.query.func === 'getAllTriples') {
        sparql.getAllTriples(res);
    }

    else {
        console.log("function not found");
    }
});


server.listen(8080);