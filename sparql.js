const SparqlClient = require('sparql-http-client');

const endpointUrl = 'http://localhost:3030/nri2/sparql';
const client = new SparqlClient({ endpointUrl });


const prefixes = `
	PREFIX ace: <http://www.semanticweb.org/XKG#> 
	PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>`

exports.getTriplesWithSubject = function(res, subject, limit) {
	var query = `SELECT * WHERE { <` + subject + `> ?label ?target } LIMIT ` + limit;
	
	var data = {links: [], nodes: {}};
	data.nodes[subject] = {label: subject};
 
 	onData = function(row){
		var current = {};
    	Object.entries(row).forEach(([key, value]) => {
			//console.log(`${key}: ${value.value} (${value.termType})`);
			current[key] = value.value;
			if (key === 'target'){
				data.nodes[value.value] = {label: value.value};
			}
			 
		});
		current.source = subject;
		data.links.push(current);
	}


	onEnd = function() {
		data.nodes = Object.values(data.nodes);
		res.send(data);
		console.log('All done');
	}

	main(res, query, data, onData, onEnd);
} 



exports.getTriplesWithObject = function(res, object, limit) {
	var query = prefixes + `SELECT * WHERE { ?source ?label <` + object + `> } LIMIT ` + limit;

	var data = {links: [], nodes: {}};
	data.nodes[object] = {label: object};
 
 	onData = function(row){
		var current = {};
    	Object.entries(row).forEach(([key, value]) => {
			//console.log(`${key}: ${value.value} (${value.termType})`);
			current[key] = value.value;
			if (key === 'source'){
				data.nodes[value.value] = {label: value.value};
			}
			 
		});
		current.target = object;
		data.links.push(current);
	}

	onEnd = function() {
		data.nodes = Object.values(data.nodes);
		res.send(data);
		console.log('All done');
	}

	main(res, query, data, onData, onEnd);
} 



exports.getAllTriples = function(res, limit) {
	var query = prefixes + `SELECT * WHERE { ?source ?label ?target } LIMIT ` + limit;

	var data = {links: [], nodes: {}};
 
 	onData = function(row){
		var current = {};
    	Object.entries(row).forEach(([key, value]) => {
			//console.log(`${key}: ${value.value} (${value.termType})`);
			current[key] = value.value;
			if (key === 'target' || key === 'source'){
				data.nodes[value.value] = {label: value.value};
			}
			 
		});
		data.links.push(current);
	}

	onEnd = function() {
		data.nodes = Object.values(data.nodes);
		res.send(data);
		console.log('All done');
	}

	main(res, query, data, onData, onEnd);
} 



exports.getTriplesByName = function(res, name, limit) {
	name = formatName(name)
	var query = prefixes + `
	SELECT ?source ?label ?target
	WHERE
	{
	  { `+ name +` ?label ?target }
	  UNION
	  { ?source ?label `+ name +` }
	}
	LIMIT ` + limit;

	var data = {links: [], nodes: {}};
	data.nodes[name] = {label: name};
 
 	onData = function(row){
		var current = {};
	
    	Object.entries(row).forEach(([key, value]) => {
			//console.log(`${key}: ${value.value} (${value.termType})`);
			//console.log(key);
			current[key] = value.value;
			if (key === 'source' || key === 'target'){
				data.nodes[value.value] = {label: value.value};
			}
			 
		});
		if (typeof current.source === 'undefined'){
			current.source = name;
		}
		else {
			current.target = name;
		}
		data.links.push(current);
	}

	onEnd = function() {
		data.nodes = Object.values(data.nodes);
		res.send(data);
		console.log('All done');
	}

	main(res, query, data, onData, onEnd);
} 

/*
exports.getNodeDegree = function(res, name) {
	var query = prefixes + `
	SELECT (COUNT(*) as ?degree) 
	{ 
		{ `+ name +` ?p ?o } 
		UNION
		{ ?s ?p `+ name +` }
	}`;

	var degree;
 
 	onData = function(row){
    	Object.entries(row).forEach(([key, value]) => {
			degree = value.value;
		});
	}

	onEnd = function() {
		data.nodes = Object.values(data.nodes);
		res.send(data);
		console.log('All done');
	}

	main(res, query, degree, onData, onEnd);
}
*/






exports.getNodes = function(res, limit, offset) {
	var query = prefixes + `
	SELECT ?node (COUNT(*) as ?degree) 
	{ 
		{ ?node ?p ?o } 
		UNION
		{ ?s ?p ?node }
	}
	GROUP BY ?node
	ORDER BY asc(?node)
	OFFSET `+ offset +`
	LIMIT `+ limit;

	var data = [];
 
	console.log(query)

 	onData = function(row){
		var current = {}
    	Object.entries(row).forEach(([key, value]) => {
			current[key] = value.value;
		});
		data.push(current);
	}

	onEnd = function() {
		res.send(data);
		console.log('All done');
	}

	main(res, query, data, onData, onEnd);
}



exports.getNodesWithFilter = function(res, limit, offset, filter) {
	var query = prefixes + `
	SELECT ?node (COUNT(*) as ?degree)
	{
		{ ?node ?p ?o .FILTER regex(str(?node), "`+ filter +`") }
		UNION
		{ ?s ?p ?node .FILTER regex(str(?node), "`+ filter +`")}
	}
    GROUP BY ?node
    ORDER BY asc(?node)
	OFFSET `+ offset +`
	LIMIT `+ limit;

	var data = [];
 
	console.log(query)

 	onData = function(row){
		var current = {}
    	Object.entries(row).forEach(([key, value]) => {
			current[key] = value.value;
		});
		data.push(current);
	}

	onEnd = function() {
		res.send(data);
		console.log('All done');
	}

	main(res, query, data, onData, onEnd);
}








exports.getTriplesByNameAndDegree = function(res, name, minDegree, limit) {
	formatedName = formatName(name)
	var query = prefixes + `
	SELECT ?source ?label ?target
	WHERE
	{
		{
			SELECT (?x as ?target) (?p as ?label) ?degree
			{
				{ `+ formatedName +` ?p ?x }
				{
					SELECT ?x (COUNT(*) as ?degree) 
					{ 
						{ ?x ?p ?o } 
						UNION
						{ ?s ?p ?x }
					}
					GROUP BY ?x
					HAVING (?degree >= ` + minDegree + `)
				}
			}
		}
		UNION
		{
			SELECT (?x as ?source) (?p as ?label) ?degree
			{
				{ ?x ?p ` + formatedName + ` }
				{
					SELECT ?x (COUNT(*) as ?degree) 
					{ 
						{ ?x ?p ?o } 
						UNION
						{ ?s ?p ?x }
					}
					GROUP BY ?x
					HAVING (?degree >= ` + minDegree + `)
				}
			}
		}
	}
	LIMIT ` + limit;

	//console.log(query)

	var data = {links: [], nodes: {}};
	data.nodes[name] = {label: name};
	console.log(data.nodes[name])
 
	onData = function(row){
		var current = {};
	
    	Object.entries(row).forEach(([key, value]) => {
			current[key] = value.value;
			if (key === 'source' || key === 'target'){
				data.nodes[value.value] = {label: value.value};
			}
			 
		});
		if (typeof current.source === 'undefined'){
			current.source = name;
		}
		else {
			current.target = name;
		}
		data.links.push(current);
	}

	onEnd = function() {
		data.nodes = Object.values(data.nodes);
		res.send(data);
		console.log('All done');
	}

	main(res, query, data, onData, onEnd);
}














 
async function main (res, query, data, onData, onEnd){

	const stream = await client.query.select(query);

 
 	stream.on('data', onData);

	stream.on('end', onEnd);

  	stream.on('error', err => {
    	console.error(err);
  	});
}




 
 
function formatName(name) {
	if (name.startsWith('http://')) {
		return '<'+name+'>'
	}
	else if (name.includes(':')) {
		return name
	}
	else {
		return '\"'+name+'\"'
	}
}
