const urlBase = 'http://localhost:8080'


const svg = d3.select("svg");
const g = svg.append("g");

const linkG = g.append("g");
const nodeG = g.append("g");
const linkTextG = g.append("g");
const nodeTextG = g.append("g");

const height = svg.attr("height");
const width = svg.attr("width");

const topLimit = 0 - height/3
const bottomLimit = height + height/3
const leftLimit = 0 - width/3
const rightLimit = width + width/3

var minDegree = 0;
var limit = 100;

var showNodeText = true;
var showLinkText = true;

var data = {nodes: [], links: []};

const prefixes = [
    {name: 'ace:', value: 'http://www.semanticweb.org/XKG#'},
    {name: 'xsd:', value: 'http://www.w3.org/2001/XMLSchema#'}];






//======== FORCE SIMULATION ========

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
            .id(function(d) {
                return d.label;
            })
            .distance(100)
            .strength(0.1))
        .force("charge", d3.forceManyBody()
            .strength(-200))
        .force("center", d3.forceCenter(width/2 , height/2))
        .force("collide", d3.forceCollide(20))
        .on("tick", ticked); 






//======== DATA REQUEST ========

function getData(parameters) {
    url = new URL('./sparql', urlBase)
    parameters.forEach(param => {
        url.searchParams.set(param.name, param.value)
        console.log("name : "+param.name+", value : "+param.value)
    });
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json'
    xhr.addEventListener('readystatechange', function() { 
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
            var newData = xhr.response;
            //console.log(newData);
            addToData(newData)
            console.log(data.links)
            reloadGraph();
        }

    });

    xhr.send(null); 

}


function addToData(newData){
    //not a good complexity... 
    newData.links.forEach(link => {
        var i = 0;
        var alreadyHere = false;
        var length = data.links.length
        while (!alreadyHere && i<length) {
            if (data.links[i].source.label === link.source 
            && data.links[i].label === link.label
            && data.links[i].target.label === link.target) {
                alreadyHere = true;    
            }
            i+=1;      
        }
        if (!alreadyHere) {
            data.links.push(link);
        }
    });
    newData.nodes.forEach(node => {
        var i = 0;
        var alreadyHere = false;
        var length = data.nodes.length
        while (!alreadyHere && i<length) {
            if (data.nodes[i].label === node.label) {
                alreadyHere = true;
            }
            i+=1;
        }
        if (!alreadyHere) {
            data.nodes.push(node);
        }
    });
}


var addSubsequent = function(d) {
    parameters = [{name: 'func', value: 'getTriplesByNameAndDegree'}, 
                  {name: 'name', value: d.label}, 
                  {name: 'minDegree', value: minDegree}, 
                  {name: 'limit', value: limit}]
    getData(parameters);
}
 





//======== GRAPH ELEMENTS ========

function reloadGraph(){
    simulation.stop();

    
    linkG.selectAll("line")
        .data(data.links)
        .join(
            enter => enter.append("line")
                .attr("stroke-width", 1)
                .attr("stroke", "black")
        );
    simulation.nodes(data.nodes);
    simulation.force("link").links(data.links);
    simulation.alpha(1).restart();


    nodeG.selectAll("circle")
        .data(data.nodes)
        .join(
            enter => enter.append("circle")
                .attr("r", 10)
                .attr("stroke", "white")
                .attr("stroke-width", 1)
        )
        //Add subsequent node on click event
        .on("click", addSubsequent);

    
    linkTextG.selectAll("text")
        .data(data.links)
        .join(
            enter => enter.append("text")
                .text(d => checkForPrefix(d.label))
                .attr("class", "linkText")
        );
    
    
    nodeTextG.selectAll("text")
        .data(data.nodes)
        .join(
            enter => enter.append("text")
                .text(d => checkForPrefix(d.label))
                .attr("class", "nodeText")
        );
    
};


function checkForPrefix(name) {
    for (let i = 0; i < prefixes.length; i++) {
        if (name.startsWith(prefixes[i].value)) {
            return prefixes[i].name + name.split(prefixes[i].value)[1];
        }
    };
    return name;
}
        





//======== GRAPH ELEMENT POSITION ========

function ticked() {
    
    nodeG.selectAll("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    
    linkG.selectAll("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
   
    linkTextG.selectAll("text")
        .attr("x", d => (d.source.x + d.target.x)/2 + 5 )
        .attr("y", d => (d.source.y + d.target.y)/2 - 5 );
    
    nodeTextG.selectAll("text")
        .attr("x", d => d.x + 11)
        .attr("y", d => d.y - 3);
}






//======== ZOOM ========

svg.call(d3.zoom()
            .extent([[0, 0], [width, height]])
            //.scaleExtent([1,8])
            .on("zoom", zoomed));
        
        
function zoomed() {
    g.attr("transform", d3.event.transform)
}






//======== START GRAPH ========

//getData('?func=getTriplesByNameAndDegree&name=http://skos.um.es/unescothes/C03379&minDegree='+minDegree+'limit='+limit);
//getData('?func=getTriplesByNameAndDegree&name=http://skos.um.es/unescothes/C02025&minDegree='+minDegree+'limit='+limit);

getData([{name: 'func', value: 'getAllTriples'}, {name: 'limit', value: limit}])

//getData(`?func=getTriplesByNameAndDegree&name=http://www.semanticweb.org/XKG#00648A3D&minDegree=5&limit=100`)

var test = [{name: 'func', value: 'getTriplesByNameAndDegree'}, 
        {name: 'name', value: 'ace:Author'}, 
        {name: 'minDegree', value: minDegree}, 
        {name: 'limit', value: limit}]
//getData(test)