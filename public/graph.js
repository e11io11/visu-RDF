//server url
const urlBase = 'http://localhost:8080'


const svg = d3.select("svg");
const g = svg.append("g");


const linkG = g.append("g");
const nodeG = g.append("g");
const linkTextG = g.append("g");
const nodeTextG = g.append("g");

const height = window.innerHeight;
const width = window.innerWidth;

var minDegree = 0;
var limit = 100;
var offset = 0;
var currentSearch = "";
var maximumBackup = 500;
var currentBackupIndex = -1;

var showNodeText = true;
var showLinkText = true;

var data = {nodes: [], links: []};

var backupArray = [];

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
            .distance(100)
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
        if (currentBackupIndex < backupArray.length) {
            backupArray = backupArray.slice(0, currentBackupIndex);
            console.log("sliced !")
        }
        backupArray.push(copy(data));
        console.log("backed up data ! index = "+currentBackupIndex)
        console.log(backupArray)
    }
}


function undo(){
    if (currentBackupIndex - 1 >= 0) {
        currentBackupIndex -= 1;
        data = backupArray[currentBackupIndex];
        reloadGraph();
        console.log("undone ! index = "+currentBackupIndex)
        console.log(data)
    }
}

function redo(){
    if (currentBackupIndex + 1 < backupArray.length) {
        currentBackupIndex +=1;
        data = backupArray[currentBackupIndex];
        reloadGraph();
        console.log("redone ! index = "+currentBackupIndex)
        console.log(data)
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


var addSubsequent = function(d) {
    parameters = [{name: 'func', value: 'getTriplesByNameAndDegree'}, 
                  {name: 'name', value: d.label}, 
                  {name: 'minDegree', value: minDegree}, 
                  {name: 'limit', value: limit}]
    serverRequest(parameters, addToGraph);
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
    g.attr("transform", d3.event.transform);
}






//======== START GRAPH ========

serverRequest([{name: 'func', value: 'getAllTriples'}, {name: 'limit', value: limit}], addToGraph)













//======== SIDE BAR ========



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
    reloadGraph();
}

$("#nodeList").on("click", "tr", function(event) {
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


serverRequest([{name: "func", value: "getNodes"}, {name: "offset", value: offset}, {name: "limit", value: limit}], updateList);

