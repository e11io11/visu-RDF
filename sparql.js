const SparqlClient = require('sparql-http-client');

const endpointUrl = 'http://localhost:3030/ds/sparql';
const client = new SparqlClient({ endpointUrl });




exports.getTriplesWithSubject = function(res, subject) {
	var query = `SELECT * WHERE { <` + subject + `> ?label ?target }`;

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

	main(res, query, data, onData);
} 



exports.getTriplesWithObject = function(res, object) {
	var query = `SELECT * WHERE { ?source ?label <` + object + `> }`;

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

	main(res, query, data, onData);
} 



exports.getTriplesByName = function(res, name) {
	var query = `
	SELECT ?source ?label ?target
	WHERE
	{
	  { <` + name + `> ?label ?target }
	  UNION
	  { ?source ?label <` + name + `> }
	}
	`;

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

	main(res, query, data, onData);
} 


exports.getNodeDegree = function(res, name) {
	var query = `
	SELECT (COUNT(*) as ?degree) 
	{ 
		{ <` + name + `> ?p ?o } 
		UNION
		{ ?s ?p <` + name + `> }
	}
	`;

	var degree;
 
 	onData = function(row){
    	Object.entries(row).forEach(([key, value]) => {
			degree = value.value;
		});
	}

	main(res, query, degree, onData);
}





exports.getTriplesByNameAndDegree = function(res, name, minDegree) {
	var query = `
	SELECT ?source ?label ?target
	WHERE
	{
		{
			SELECT (?x as ?target) (?p as ?label) ?degree
			{
				{ <` + name + `> ?p ?x }
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
				{ ?x ?p <` + name + `> }
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
	LIMIT 100
	`;

	var data = {links: [], nodes: {}};
	data.nodes[name] = {label: name};
 
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

	main(res, query, data, onData);
}








 
async function main (res, query, data, onData) {
	const stream = await client.query.select(query);

 
 	stream.on('data', onData);

	stream.on('end', () => {
		data.nodes = Object.values(data.nodes);
		res.send(data);
        console.log('All done');
	})
  	stream.on('error', err => {
    	console.error(err);
  	});
}



function uniqueArray( ar ) {
	var j = {};
  
	ar.forEach( function(v) {
	  j[v+ '::' + typeof v] = v;
	});
  
	return Object.keys(j).map(function(v){
	  return j[v];
	});
  } 
 