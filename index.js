const svg = d3.select("svg")
    .attr("cursor", "grab")

const height = svg.attr("height");
const width = svg.attr("width")

/*
const data = [
    {object: "Jean", predicat: "estUne", subject: "personne"},
    {object: "Jean", predicat: "aime", subject: "pomme"},
    {object: "pomme", predicat: "est", subject: "nourriture"}];
*/

const nodes = [
    {name: "Jean"},
    {name: "personne"},
    {name: "pomme"},
    {name: "nourriture"},
    {name: "Paul"},
    {name: "Pierre"}
];

const links = [
    {source: "Jean", target: "personne", label: "est"},
    {source: "Jean", target: "pomme", label: "aime"},
    {source: "pomme", target: "nourriture", label: "est"},
    {source: "Paul", target: "personne", label: "est"},
    {source: "Paul", target: "pomme", label: "aimePas"},
    {source: "Pierre", target: "personne", label: "est"}
];

/*
function getNodes(data){
    node = []
    data.forEach(triple => {
        if (!node.include(triple.object))
            node.append({name: triple.object});
        if (!node.include(triple.subject))
            node.append(triple.subject)
    });
}
*/

//====== Force ======

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links)
        .id(function(d) {
            return d.name;
        })
        .distance(200)
        .strength(1)
        )
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
};



//====== Drag ======

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

//====== Graph elements ======    

const nodeG = svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
        .attr("r", 10)
    //Drag behavior
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));



const linkG = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .attr("marker-end", "url(#head)");

const arrowHeadG = svg.append("svg:defs")
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
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
    .append("svg:polyline")
        .attr("points", "3,-5 10,0 3,5")





