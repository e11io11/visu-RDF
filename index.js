const svg = d3.select("svg");
    //.attr("cursor", "grab")

const height = svg.attr("height");
const width = svg.attr("width");

//RDF file name and format
const file = "data.ttl";
const format = "Turtle";


//====== Parsing ======

const ttl = `@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ex:      <http://www.example.org/schemas/vehicles#> .
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

# Classes
ex:MotorVehicle
      rdf:type rdfs:Class .

ex:Person
      rdf:type rdfs:Class .

ex:PassengerVehicle
      rdf:type rdfs:Class ;
      rdfs:subClassOf ex:MotorVehicle .

ex:Van
      rdf:type rdfs:Class ;
      rdfs:subClassOf ex:MotorVehicle .

ex:MiniVan
      rdf:type rdfs:Class ;
      rdfs:subClassOf ex:PassengerVehicle , ex:Van .

ex:Truck
      rdf:type rdfs:Class ;
      rdfs:subClassOf ex:MotorVehicle .

ex:companyCar
      rdf:type ex:MotorVehicle .

<http://www.w3.org/2001/XMLSchema#integer>
      rdf:type rdfs:DataType .

# Properties

ex:driver
      rdf:type rdf:Property ;
      rdfs:domain ex:MotorVehicle .

ex:registeredTo
      rdf:type rdf:Property ;
      rdfs:domain ex:MotorVehicle ;
      rdfs:range ex:Person .

ex:rearSeatLegRoom
      rdf:type rdf:Property ;
      rdfs:domain ex:PassengerVehicle ;
      rdfs:range <http://www.w3.org/2001/XMLSchema#integer> .

ex:primaryDriver
      rdf:type rdf:Property ;
      rdfs:subPropertyOf ex:driver .

# Instances

ex:johnSmithsCar
      rdf:type ex:PassengerVehicle ;
      ex:primaryDriver <http://www.example.org/staffid/85740> ;
      ex:rearSeatLegRoom "127"^^<xsd:integer> ;
      ex:registeredTo <http://www.example.org/staffid/85740> .

`;


const N3 = require("n3");

const parser = new N3.Parser({ format: format });

var data = {links: [], nodes: []};
var output = parser.parse(ttl, function(error, quad, prefixes) {
    if (quad) {
        //LINKS
        data.links.push({source: quad.object.id, target: quad.subject.id, label: quad.predicate.id});
    }
    else {
        //PREFIXES
        data.prefixes = {label: Object.keys(prefixes), 
                         regex: Object.values(prefixes).map(function(str){
                             return new RegExp("^"+str)
                         })};


        //NODES
        //Array of nodes
        var nodeArray = [];
        for(var link of data.links){
            nodeArray.push(link.source);
            nodeArray.push(link.target); 
        }
        //Array of distinct nodes 
        var distinctNodeArray = Array.from(new Set(nodeArray))
        //Array of distinct nodes as JS Objects
        distinctNodeArray.forEach(node => {
            data.nodes.push({label: node})
        })


        console.log(data.nodes)
        console.log(data.links);
        console.log(data.prefixes);
        
        
        //====== Force ======
        
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links)
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
            <g></g>         //linkTextG: link text
            <g></g>         //nodeTextG: node text
            </g>
        </svg>
        */
        
        
        const elements = svg.append("g")
        
        const linkG = elements.append("g")
            .selectAll("line")
            .data(data.links)
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
            .data(data.nodes)
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
            .data(data.links)
            .enter().append("text")
                .text(function(d) {return textWithPrefix(d)})
                .attr("fill", "Black");
        
        
        const nodeTextG = elements.append("g")
            .selectAll("text")
            .data(data.nodes)
            .enter().append("text")
                .text(function(d) {return textWithPrefix(d)})
                .attr("fill", "Black");
        
        
        function textWithPrefix(d) {
            var i = 0
            while (i < data.prefixes.regex.length){
                if (data.prefixes.regex[i].test(d.label)){
                  return d.label.replace(data.prefixes.regex[i], data.prefixes.label[i]+":")  
                }
                i+=1
            }
            return d.label
        }
        
        //====== Zoom ======
        
        svg.call(d3.zoom()
            .extent([[0, 0], [width, height]])
            //.scaleExtent([1,8])
            .on("zoom", zoomed));
        
        
        function zoomed() {
            elements.attr("transform", d3.event.transform)
        }
    }
});








