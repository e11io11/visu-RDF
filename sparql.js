const SparqlClient = require('sparql-http-client');

const endpointUrl = 'http://localhost:3030/ds/sparql';
const client = new SparqlClient({ endpointUrl });

//may be good to add more security to the query system


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
 