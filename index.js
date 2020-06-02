const svg = d3.select("svg")

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
    //{source: "Paul", target: "pomme", label: "aimePas"},
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


const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(function(d) {
        return d.name;
    }))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width/2 , height/2))
    .on("tick", ticked);


const nodeG = svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
        .attr("r", 10);


const linkG = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
        .attr("stroke-width", 3)
        .attr("stroke", "black");
        

function ticked() {
    nodeG
        .attr("cx", function(d) {
            return d.x
        })
        .attr("cy", function(d) {
            return d.y
        });
    linkG
        .attr("x1", function(d) {
            return d.source.x
        })
        .attr("y1", function(d) {
            return d.source.y
        })
        .attr("x2", function(d) {
            return d.target.x
        })
        .attr("y2", function(d) {
            return d.target.y
        })
};

