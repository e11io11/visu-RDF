//server url
const urlBase = 'http://localhost:8080'


const svg = d3.select("svg");
const g = svg.append("g");


const linkG = g.append("g");
const nodeG = g.append("g");
const linkTextG = g.append("g").attr("id", "linkTextG");
const nodeTextG = g.append("g").attr("id", "nodeTextG");
const arrowHeadG = g.append("svg:defs")
    .selectAll("marker")
        .data(["head"])
        .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 0)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .attr("class", "arrowHead")
        .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");
            


const height = window.innerHeight;
const width = window.innerWidth;

var minDegree = 0;
var limit = 100;
var offset = 0;
var currentSearch = "";
var maximumBackup = 30;
var currentBackupIndex = -1;

var showNodeText = true;
var showLinkText = true;

var currentAction = "add"

var data = {nodes: [], links: []};

var backupArray = [];

//prefixes have to be added manually
const prefixes = [
    {name: 'ace:', value: 'http://www.semanticweb.org/XKG#'},
    {name: 'xsd:', value: 'http://www.w3.org/2001/XMLSchema#'}];

var currentList = [];




//======== FORCE SIMULATION ========

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
            .id(function(d) {
                return d.label;
            })
            .distance(200)
            .strength(0.1))
        .force("charge", d3.forceManyBody()
            .strength(-200))
        .force("center", d3.forceCenter(width/2, height/2))
        .force("collide", d3.forceCollide(20))
        .on("tick", ticked); 






//======== DATA REQUEST ========

function serverRequest(parameters, callback) {
    url = new URL('./sparql', urlBase)
    parameters.forEach(param => {
        url.searchParams.set(param.name, param.value)
        //console.log("name : "+param.name+", value : "+param.value)
    });
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json'
    xhr.addEventListener('readystatechange', function() { 
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
            var newData = xhr.response;
            callback(newData);
        }

    });

    xhr.send(null); 

}

var addToGraph = function(newData) {
    addToData(newData);
    backupData();
    reloadGraph();
}


function backupData(){
    if (currentBackupIndex + 1 < maximumBackup) {
        currentBackupIndex += 1;
    }
    else {
        backupArray.shift();
    }
    if (currentBackupIndex < backupArray.length) {
        backupArray = backupArray.slice(0, currentBackupIndex);
        //console.log("sliced !")
    }
    backupArray.push(copy(data));
    //console.log("backed up data ! index = "+currentBackupIndex)
    //console.log(backupArray)
}


function undo(){
    if (currentBackupIndex - 1 >= 0) {
        currentBackupIndex -= 1;
        data = backupArray[currentBackupIndex];
        reloadGraph();
        //console.log("undone ! index = "+currentBackupIndex)
        //console.log(data)
    }
}

function redo(){
    if (currentBackupIndex + 1 < backupArray.length) {
        currentBackupIndex +=1;
        data = backupArray[currentBackupIndex];
        reloadGraph();
        //console.log("redone ! index = "+currentBackupIndex)
        //console.log(data)
    }
}


function copy(data){
    return {nodes: [...data.nodes], links: [...data.links]}
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


var action = function(d) {
    if (currentAction === "add") {
        addSubsequent(d);
    }
    else {
        removeNode(d);
    }
}

var addSubsequent = function(d) {
    parameters = [{name: 'func', value: 'getTriplesByNameAndDegree'}, 
                  {name: 'name', value: d.label}, 
                  {name: 'minDegree', value: minDegree}, 
                  {name: 'limit', value: limit}]
    serverRequest(parameters, addToGraph);
}


var removeNode = function(d) {
    //console.log("removing : "+d.label)
    var i = 0;
    while (i < data.links.length) {
        link = data.links[i];
        if (link.source.label === d.label || link.target.label === d.label) {
            //remove link from data
            //console.log("removing from data.links")
            //console.log(data.links[i])
            data.links.splice(i, 1);
            
            if (link.source.label === d.label) {
                var otherNode = link.target.label;
            }
            else {
                var otherNode = link.source.label;
            }
            //we check if the other node is no longer linked to anything
            var j = 0
            var found = false;
            while (j < data.links.length && !found) {
                if (data.links[j].source.label === otherNode || data.links[j].target.label === otherNode) {
                    found = true;
                }
                j+=1
            }
            if (!found) {
                //if it is no longer linked to anything we remove the node
                var done = false;
                var j = 0;
                while (j < data.nodes.length && !done) {
                    if (data.nodes[j].label === otherNode) {
                        data.nodes.splice(j, 1);
                        done = true
                    }  
                    j += 1 
                }
            }
        }
        else {
            i += 1;
        }
    }

    //we remove the node itself
    
    var i = 0;
    var done = false;
    while (i < data.nodes.length && !done) {
        if (data.nodes[i].label === d.label) {
            //console.log("removing from data.nodes")
            //console.log(data.nodes[i])
            data.nodes.splice(i, 1);
            done = true;
        }  
        i += 1 
    }
    
    console.log(data)
    backupData();
    reloadGraph();
}
 





//======== GRAPH ELEMENTS ========

function reloadGraph(){
    simulation.stop();

    
    linkG.selectAll("polyline")
        .data(data.links)
        .join(
            enter => enter.append("polyline")
                .attr("class", "line")
                .attr("marker-mid", "url(#head)")
        );
    simulation.nodes(data.nodes);
    simulation.force("link").links(data.links);
    simulation.alpha(1).restart();


    nodeG.selectAll("circle")
        .data(data.nodes)
        .join(
            enter => enter.append("circle")
                .attr("r", 10)
                .attr("class", "node")
        )
        //Add subsequent node on click event
        .on("dblclick", action)
        //drag behavior
        .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

    

    linkTextG.selectAll("text")
        .data(data.links)
        .join(
            enter => enter.append("text")
                .text(d => checkForPrefix(d.label))
                .attr("class", "linkText"),
            update => update
                .text(d => checkForPrefix(d.label))
        );
    
    
    
    nodeTextG.selectAll("text")
        .data(data.nodes)
        .join(
            enter => enter.append("text")
                .text(d => checkForPrefix(d.label))
                .attr("class", "nodeText"),
            update => update
                .text(d => checkForPrefix(d.label))
        );
    
};


function checkForPrefix(name) {
    //console.log("name: "+name)
    for (let i = 0; i < prefixes.length; i++) {
        if (name.startsWith(prefixes[i].value)) {
            //console.log("with prefix: "+prefixes[i].name + name.split(prefixes[i].value)[1])
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
    
    /*
    linkG.selectAll("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
    */
    
    linkG.selectAll("polyline")
        .attr("points", function(d) {
            return d.source.x + "," + d.source.y + " " + 
                (d.source.x + d.target.x)/2 + "," + (d.source.y + d.target.y)/2 + " " +
                d.target.x + "," + d.target.y; 
        });
        

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
            .on("zoom", zoomed))
            //disables zoom on double click
            .on("dblclick.zoom", null);
        
        
function zoomed() {
    g.attr("transform", d3.event.transform);
}






//======== NODE DRAG ========

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





//======== START GRAPH ========

serverRequest([{name: 'func', value: 'getInitTriples'}, {name: 'limit', value: limit}], addToGraph)

//serverRequest([{name: 'func', value: 'getAllTriples'}], addToGraph)













//======== NAVIGATION ========



var updateList = function(nodeList) {
    currentList = nodeList;
    var table = $('#nodeList');
    table.empty();
    table.append('<tr class="header"><th>Name</th><th>Degree</th></tr>')
    nodeList.forEach(node => {
        table.append('<tr><td class="nodeName">'+checkForPrefix(node.node)+'</td><td>'+node.degree+'</td></tr>');
        //console.log("updating: <tr><td>"+node.node+"</td><td>"+node.degree+"</td></tr>");
    });
}

var newGraph = function(newData) {
    //console.log(newData);
    data = newData;
    backupData();
    console.log(data)
    reloadGraph();
}

$("#nodeList").on("click", "tr", function() {
    //console.log($(this).index());
    serverRequest([
        {name: 'func', value: 'getTriplesByNameAndDegree'},
        {name: 'name', value: currentList[$(this).index()-1].node}, 
        {name: 'minDegree', value: minDegree}, 
        {name: 'limit', value: limit}],
        newGraph);
});



$("#previous").click(function() {
    if (offset >= 0) {
        offset -= 100;
    }
    serverRequest([
        {name: "func", value: "getNodesWithFilter"}, 
        {name: "offset", value: offset}, 
        {name: "limit", value: limit},
        {name: "filter", value: currentSearch}], 
        updateList);
});


$("#next").click(function() {
    offset += 100;

    serverRequest([
        {name: "func", value: "getNodesWithFilter"}, 
        {name: "offset", value: offset}, 
        {name: "limit", value: limit},
        {name: "filter", value: currentSearch}], 
        updateList);
});


$("#search").click(function() {
    var filter = $("#searchInput").val();
    //console.log("attempting to search : "+filter)
    //There is probably a better way to sanitize input.
    //I am not sure if this is sufficient
    if (filter.includes('"')) {
        alert("bad input");
    }
    else {
        offset = 0;
        currentSearch = filter;
        serverRequest([
            {name: "func", value: "getNodesWithFilter"}, 
            {name: "offset", value: offset}, 
            {name: "limit", value: limit},
            {name: "filter", value: currentSearch}], 
            updateList);

    }
});


$("#minDegree").children('input[type=range]').change(function() {
    //console.log("change")
    $("#minDegree").children("label").text("Minimum degree : "+$(this).val())
    minDegree = $(this).val();
});

$("#limit").children('input[type=range]').change(function() {
    $("#limit").children("label").text("Maximum number of added nodes : "+$(this).val())
    limit = $(this).val();
});

$('#undo').click(function() {
    undo();
});

$('#redo').click(function() {
    redo();
})

$(".toggleButton").click(function() {
    $(".toggleButton").removeClass("activeButton");
    $(this).addClass("activeButton");
    currentAction = $(this).attr("id");
})


$("#showNodeText input").change(function() {
    if (this.checked) {
        $("#nodeTextG").show();
    }
    else {
        $("#nodeTextG").hide();
    }
});


$("#showLinkText input").change(function() {
    if (this.checked) {
        $("#linkTextG").show();
    }
    else {
        $("#linkTextG").hide();
    }
});





serverRequest([{name: "func", value: "getNodes"}, {name: "offset", value: offset}, {name: "limit", value: limit}], updateList);

