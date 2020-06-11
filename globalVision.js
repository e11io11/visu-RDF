const svg = d3.select("svg");
var g = svg.append("g");

const height = svg.attr("height");
const width = svg.attr("width");

const format = "Turtle";

//====== Parsing ======

const ttl = `@prefix : <#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix dc: <http://purl.org/dc/elements/1.1/> .
@prefix obo: <http://purl.obolibrary.org/obo/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix vivo: <http://vivoweb.org/ontology/core#> .
@prefix wikidata: <http://www.wikidata.org/entity/> .
@prefix dbpedia: <http://dbpedia.org/resource/> .

:GermanyStates
a dct:Dataset ;
dct:source <http://www.wikidata.org/entity/Q830106> ;
dct:title "States of Germany" ;
dct:description "This dataset was created by Elena Liventsova and Christian Hauschke for use in current research information system VIVO at University of Applied Sciences and Arts Hannover, Germany and was updated by Niklas Bendixen for in the VIVO of German National Library of Science and Technology. It contains information about German states, including GND-, Wikidata-, and DBpedia-links, and labels in German and English. It is tested with VIVO 1.6 and 1.7." ;
dct:creator <http://lobid.org/organisation/DE-960> ;
dct:created "2015-01-19" ;
dc:rights "This dataset is available under the Creative Commons Public Domain Dedication (CC0)." ;
dct:rights <http://creativecommons.org/publicdomain/zero/1.0/> .

<http://sws.geonames.org/2921044/> a vivo:Country ;
rdfs:seeAlso <http://d-nb.info/gnd/4011889-7> ;
rdfs:seeAlso <http://dbpedia.org/resource/Germany> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q183> ;
rdfs:label "Bundesrepublik Deutschland"@de ;
rdfs:label "Federal Republic of Germany"@en .

<http://sws.geonames.org/2953481/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4004176-1> ;
rdfs:seeAlso <http://dbpedia.org/resource/Baden-Württemberg> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q985> ;
rdfs:label "Baden-Württemberg"@de ;
rdfs:label "Baden-Württemberg"@en .

<http://sws.geonames.org/2951839/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4005044-0> ;
rdfs:seeAlso <http://dbpedia.org/resource/Bavaria> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q980> ;
rdfs:label "Bayern"@de ;
rdfs:label "Bavaria"@en .

<http://sws.geonames.org/2950157/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4005728-8> ;
rdfs:seeAlso <http://dbpedia.org/resource/Berlin> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q64> ;
rdfs:label "Berlin"@de ;
rdfs:label "Berlin"@en .

<http://sws.geonames.org/2945356/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4007955-7> ;
rdfs:seeAlso <http://dbpedia.org/resource/Brandenburg> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1208> ;
rdfs:label "Brandenburg"@de ;
rdfs:label "Brandenburg"@en .

<http://sws.geonames.org/2944387/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4008135-7> ;
rdfs:seeAlso <http://dbpedia.org/resource/Bremen_(state)> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1209> ;
rdfs:label "Freie Hansestadt Bremen"@de ;
rdfs:label "Free Hanseatic City of Bremen"@en .

<http://sws.geonames.org/2911297/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4023118-5> ;
rdfs:seeAlso <http://dbpedia.org/resource/Hamburg> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1055> ;
rdfs:label "Freie und Hansestadt Hamburg"@de ;
rdfs:label "Free and Hanseatic City of Hamburg"@en .

<http://sws.geonames.org/2905330/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4024729-6> ;
rdfs:seeAlso <http://dbpedia.org/resource/Hesse> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1199> ;
rdfs:label "Hessen"@de ;
rdfs:label "Hesse"@en .

<http://sws.geonames.org/2872567/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4242861-0> ;
rdfs:seeAlso <http://dbpedia.org/resource/Mecklenburg-Vorpommern> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1196> ;
rdfs:label "Mecklenburg-Vorpommern"@de ;
rdfs:label "Mecklenburg-Western Pomerania"@en .

<http://sws.geonames.org/2862926/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4042226-4> ;
rdfs:seeAlso <http://dbpedia.org/resource/Lower_Saxony> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1197> ;
rdfs:label "Niedersachsen"@de ;
rdfs:label "Lower Saxony"@en .

<http://sws.geonames.org/2861876/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4042570-8> ;
rdfs:seeAlso <http://dbpedia.org/resource/North_Rhine-Westphalia> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1198> ;
rdfs:label "Nordrhein-Westfalen"@de ;
rdfs:label "North Rhine-Westphalia"@en .

<http://sws.geonames.org/2847618/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4049795-1> ;
rdfs:seeAlso <http://dbpedia.org/resource/Rhineland-Palatinate> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1200> ;
rdfs:label "Rheinland-Pfalz"@de ;
rdfs:label "Rhineland-Palatinate"@en .

<http://sws.geonames.org/2842635/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4076919-7> ;
rdfs:seeAlso <http://dbpedia.org/resource/Saarland> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1201> ;
rdfs:label "Saarland"@de ;
rdfs:label "Saarland"@en .

<http://sws.geonames.org/2842566/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4051176-5> ;
rdfs:seeAlso <http://dbpedia.org/resource/Saxony> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1202> ;
rdfs:label "Sachsen"@de ;
rdfs:label "Saxony"@en .

<http://sws.geonames.org/2842565/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4051181-9> ;
rdfs:seeAlso <http://dbpedia.org/resource/Saxony-Anhalt> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1206> ;
rdfs:label "Sachsen-Anhalt"@de ;
rdfs:label "Saxony-Anhalt"@en .

<http://sws.geonames.org/2838632/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4052692-6> ;
rdfs:seeAlso <http://dbpedia.org/resource/Schleswig-Holstein> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1194> ;
rdfs:label "Schleswig-Holstein"@de ;
rdfs:label "Schleswig-Holstein"@en .

<http://sws.geonames.org/2822542/> a vivo:StateOrProvince ;
obo:BFO_0000050 <http://sws.geonames.org/2921044/> ;
rdfs:seeAlso <http://d-nb.info/gnd/4059979-6> ;
rdfs:seeAlso <http://dbpedia.org/resource/Thuringia> ;
rdfs:seeAlso <http://wikidata.org/wiki/Q1205> ;
rdfs:label "Thüringen"@de ;
rdfs:label "Thuringia"@en .`;


const N3 = require("n3");

const parser = new N3.Parser({ format: format });

//data contains : - an array of all links as objects : {source: "nodeName", target: "nodeName", label: "predicatName"}
//                - an array of all nodes as objects : {label: "nodeName"}  
//                - an array of all prefixes as regExp
var data = {links: [], nodes: []};
//nodeObject contains all nodes as attributes, and their links as values.
var nodeObject = {}

parser.parse(ttl, function(error, quad, prefixes) {
    if (quad) {
        //LINKS
        var current = {source: quad.subject.id, target: quad.object.id, label: quad.predicate.id}
        //console.log(current);
        data.links.push({source: quad.subject.id, target: quad.object.id, label: quad.predicate.id});
        //console.log(data.links)
        //NODES
        if (typeof nodeObject[current.source] === "undefined"){
            nodeObject[current.source] = [];
            //console.log({label: current.source})
            data.nodes.push({label: current.source});
        }
        if (typeof nodeObject[current.target] === "undefined"){
            nodeObject[current.target] = [];
            data.nodes.push({label: current.target})
        }
        //console.log(data.nodes)
        //console.log(current)
        nodeObject[current.source].push(current)
        nodeObject[current.target].push(current)
    }
    else {
        //PREFIXES
        data.prefixes = {label: Object.keys(prefixes), 
            regex: Object.values(prefixes).map(function(str){
                return new RegExp("^"+str)
            })
        };
    }
});

const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links)
        .id(function(d) {
            return d.label;
        })
        .distance(100)
        .strength(1))
    .force("charge", d3.forceManyBody()
        .strength(-20))
    .force("center", d3.forceCenter(width/2 , height/2))
    .on("tick", ticked);

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

(function(){
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
    
        
    //update force
    simulation.nodes(data.nodes);
    //console.log(data.links);
    simulation.force("link").links(data.links);
    simulation.alpha(0.3).restart();

    setTimeout(arguments.callee, 10000);
})();



