const svg = d3.select("svg");
const g = svg.append("g");
const linkG = g.append("g");
const nodeG = g.append("g");

const height = svg.attr("height");
const width = svg.attr("width");

const topLimit = 0 - height/3
const bottomLimit = height + height/3
const leftLimit = 0 - width/3
const rightLimit = width + width/3

var minDegree = 5

data = {nodes: [], links: []};


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


function getData(parameters) {
    console.log("loading file")
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/sparql'+parameters);
    xhr.responseType = 'json'
    xhr.addEventListener('readystatechange', function() { 
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
            var newData = xhr.response;
            //console.log(newData);
            addToData(newData)
            console.log(data.nodes)
            reloadGraph();
        }

    });

    xhr.send(null); 

}


function addToData(newData){
    //not a good complexity... very bad
    //to be redone at some point probably
    newData.links.forEach(link => {
        var i = 0;
        var alreadyHere = false;
        var length = data.links.length
        while (!alreadyHere && i<length) {
            if (data.links[i].source === link.source 
            && data.links[i].label === link.label
            && data.links[i].target === link.target) {
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
    getData('?func=getTriplesByNameAndDegree&name='+d.label+'&minDegree='+minDegree);
}
 

function reloadGraph(){
    simulation.stop();

    
    linkG.selectAll("line")
        .data(data.links)
        .join(
            enter => enter.append("line")
                .attr("stroke-width", 3)
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
        .on("click", addSubsequent);
    
};

function ticked() {
    
    nodeG.selectAll("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    
    linkG.selectAll("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
    /*
    linkG
        .attr("d", function(d) { 
            var xOffset;
            var yOffset;
            if (d.source.x < d.target.x && d.source.y < d.target.y){
                xOffset = 1+d.linkNum/10;
                yOffset = 1-d.linkNum/10;
            }
            else if (d.source.x > d.target.x && d.source.y < d.target.y){
                xOffset = 1+d.linkNum/10; 
                yOffset = 1+d.linkNum/10;
            }
            else if (d.source.x > d.target.x && d.source.y > d.target.y){
                xOffset = 1-d.linkNum/10; 
                yOffset = 1+d.linkNum/10;
            }
            else {
                xOffset = 1-d.linkNum/10; 
                yOffset = 1-d.linkNum/10;
            }

            return "M" 	+ d.source.x + "," + d.source.y
                + "Q" + ((d.source.x + d.target.x)*xOffset)/2 
                + "," + ((d.source.y + d.target.y)*yOffset)/2
                + "," + d.target.x + "," + d.target.y});
    
    linkTextG
        .attr("x", function(d) { return (d.source.x + d.target.x)/2 + 5 })
        .attr("y", function(d) { return (d.source.y + d.target.y)/2 - 5 });
    
    nodeTextG
        .attr("x", function(d) { return d.x })
        .attr("y", function(d) { return d.y });
    */

}


svg.call(d3.zoom()
            .extent([[0, 0], [width, height]])
            //.scaleExtent([1,8])
            .on("zoom", zoomed));
        
        
        function zoomed() {
            g.attr("transform", d3.event.transform)
        }

getData('?func=getTriplesByNameAndDegree&name=http://skos.um.es/unescothes/C03379&minDegree='+minDegree);
getData('?func=getTriplesByNameAndDegree&name=http://skos.um.es/unescothes/C02025&minDegree='+minDegree);
