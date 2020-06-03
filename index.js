const svg = d3.select("svg")
    //.attr("cursor", "grab")

const height = svg.attr("height");
const width = svg.attr("width")


const nodes = [
    {label: "Jean"},
    {label: "personne"},
    {label: "pomme"},
    {label: "nourriture"},
    {label: "Paul"},
    {label: "Pierre"},
    {label: "Alice"},
    {label: "dessiner"}
];

const links = [
    {source: "Jean", target: "personne", label: "est"},
    {source: "Jean", target: "pomme", label: "aime"},
    {source: "pomme", target: "nourriture", label: "est"},
    {source: "Paul", target: "personne", label: "est"},
    {source: "Paul", target: "pomme", label: "aimePas"},
    {source: "Pierre", target: "personne", label: "est"},
    {source: "Alice", target: "dessiner", label: "aime"}
];

/*
function getNodes(data){
    node = []
    data.forEach(triple => {
        if (!node.include(triple.object))
            node.append({label: triple.object});
        if (!node.include(triple.subject))
            node.append(triple.subject)
    });
}
*/

//====== Force ======

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links)
        .id(function(d) {
            return d.label;
        })
        .distance(200)
        .strength(1))
    .force("charge", d3.forceManyBody()
        .strength(-500))
    .force("center", d3.forceCenter(width/2 , height/2))
    .on("tick", ticked);


function ticked() {
    
    nodeG
        .attr("cx", function(d) { return d.x })
        .attr("cy", function(d) { return d.y });

    linkG
        .attr("x1", function(d) { return d.source.x })
        .attr("y1", function(d) { return d.source.y })
        .attr("x2", function(d) { return d.target.x })
        .attr("y2", function(d) { return d.target.y });

    linkTextG
        .attr("x", function(d) { return (d.source.x + d.target.x)/2 + 5 })
        .attr("y", function(d) { return (d.source.y + d.target.y)/2 - 5 });
    
    nodeTextG
        .attr("x", function(d) { return d.x + 10 })
        .attr("y", function(d) { return d.y - 10 });
};



//====== Node drag ======

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    //nodeG.attr("cursor", "grabbing");
    //svg.attr("cursor", "grabbing")
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    //nodeG.attr("cursor", "grab")
    //svg.attr("cursor", "default")
  }



//====== Graph elements ======  

/*
<svg>   //svg
  <g>   //elements: all elements
    <g></g>         //linkG: arrow lines
    <defs></defs>   //arrowHeadG: arrow heads
    <g></g>         //nodeG: nodes
  </g>
</svg>
*/


const elements = svg.append("g")

const linkG = elements.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
        .attr("stroke-width", 2)
        .attr("stroke", "grey")
        .attr("marker-end", "url(#head)")
    

const arrowHeadG = elements.append("svg:defs")
    .selectAll("marker")
    .data(["head"])
    .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 18)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", 1.5)
    .append("svg:polyline")
        .attr("points", "3,-5 10,0 3,5");


const nodeG = elements.append("g")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
        .attr("r", 10)
    //Drag behavior
    //.attr("cursor", "grab")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

const linkTextG = elements.append("g")
    .selectAll("text")
    .data(links)
    .enter().append("text")
        .text(function(d) { return d.label })
        .attr("fill", "Black");


const nodeTextG = elements.append("g")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
        .text(function(d) { return d.label })
        .attr("fill", "Black");



//====== Zoom ======

svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    //.scaleExtent([1,8])
    .on("zoom", zoomed));


function zoomed() {
    elements.attr("transform", d3.event.transform)
}





