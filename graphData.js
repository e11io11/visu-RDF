const streamObject = require('stream-json/streamers/streamObject');
const path = require('path');
const fs = require('fs');


const filename = path.join('./public/data.json');

exports.getAllTriples = function(res){
    const jsonStream = streamObject.withParser();

    var data = {links: [], nodes: []}
    jsonStream.on('data', ({key, value}) => {
        data.nodes.push({label: key});
        value.isSourceIn.forEach(element => {
            data.links.push(element);
        });
    });
    
    jsonStream.on('end', () => {
        res.send(data);
        console.log('All done');
    });
    
    fs.createReadStream(filename).pipe(jsonStream.input);
}


exports.getAllData = function(res){
    const jsonStream = streamObject.withParser();

    var data = {};
    jsonStream.on('data', ({key, value}) => {
        data[key] = value;
        //console.log(data)
    });


    jsonStream.on('end', () => {
        res.send(data);
        console.log('All done');
    });

    fs.createReadStream(filename).pipe(jsonStream.input);
}



