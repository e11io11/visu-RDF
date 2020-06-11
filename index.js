const svg = d3.select("svg");
    //.attr("cursor", "grab")

const height = svg.attr("height");
const width = svg.attr("width");

//RDF file name and format
const file = "data.ttl";
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

var data = {links: [], nodes: []};
var output = parser.parse(ttl, function(error, quad, prefixes) {
    if (quad) {
        //LINKS
        console.log({source: quad.subject.id, target: quad.object.id, label: quad.predicate.id});
        data.links.push({source: quad.subject.id, target: quad.object.id, label: quad.predicate.id});
    }
    else {
        //code from http://jsfiddle.net/7HZcR/3/
        //sort links by source, then target
        data.links.sort(function(a,b) {
            if (a.source > b.source) 
                return 1;
            else if (a.source < b.source) 
                return -1;
            else {
                if (a.target > b.target) 
                    return 1;
                if (a.target < b.target) 
                    return -1;
                else 
                    return 0;
            }
        });
        //any links with duplicate source and target get an incremented 'linkNum'
        for (var i=0; i<data.links.length; i++) {
            if (i != 0 &&
                    data.links[i].source == data.links[i-1].source &&
                    data.links[i].target == data.links[i-1].target) {
                data.links[i].linkNum = data.links[i-1].linkNum + 1;
            }
            else 
                data.links[i].linkNum = 0;
        };

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
                .distance(100000)
                .strength(1))
            .force("charge", d3.forceManyBody()
                .strength(-20))
            .force("center", d3.forceCenter(width/2 , height/2))
            .on("tick", ticked);
        
        console.log(data.links)
        function ticked() {
            
            nodeG
                .attr("cx", function(d) { return d.x })
                .attr("cy", function(d) { return d.y });
        
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
            .selectAll("path")
            .data(data.links)
            .enter().append("path")
                .attr("marker-end", "url(#head)")
                .attr("class", "line")
            
        
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
                .attr("class", "arrowHead")
            .append("svg:polyline")
                .attr("points", "3,-5 10,0 3,5");
        
        
        const nodeG = elements.append("g")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
                .attr("r", 150)
                .attr("class", "node")
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
                .attr("class", "linkText")
            //Outline
            /*
            .clone(true).lower()
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-width", 3);
            */
        
        
        const nodeTextG = elements.append("g")
            .selectAll("text")
            .data(data.nodes)
            .enter().append("text")
                .text(function(d) {return textWithPrefix(d)})
                .attr("class", "nodeText")
        
        
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








