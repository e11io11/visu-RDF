const svg = d3.select("svg");
var g = svg.append("g");

const height = svg.attr("height");
const width = svg.attr("width");

data = {nodes: [], links: []};


const simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
            .id(function(d) {
                return d.label;
            })
            .distance(100)
            .strength(1))
        .force("charge", d3.forceManyBody()
            .strength(-20))
        .force("center", d3.forceCenter(width/2 , height/2))
        .on("tick", ticked); 


function loadFile() {
    console.log("loading file")
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/sparql');
    xhr.responseType = 'json'
    xhr.addEventListener('readystatechange', function() { 
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
            console.log(xhr.response);
            data = xhr.response;
            reloadGraph();
        }

    });

    xhr.send(null); 

}

 

function reloadGraph(){
    simulation.stop();

    g.selectAll("circle")
        .data(data.nodes)
        .join(
            enter => enter.append("circle")
                .attr("r", 10)
        );
    
    g.selectAll("line")
        .data(data.links)
        .join(
            enter => enter.append("line")
                .attr("stroke-width", 3)
                .attr("stroke", "black")
        );
    simulation.nodes(data.nodes);
    simulation.force("link").links(data.links);
    simulation.alpha(1).restart();
    
};

function ticked() {
    
    g.selectAll("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    
    g.selectAll("line")
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


loadFile();